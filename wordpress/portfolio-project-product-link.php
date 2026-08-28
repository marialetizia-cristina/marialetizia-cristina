<?php
/**
 * Plugin Name: Portfolio Letizia - Project Product Link
 * Description: Links a WordPress portfolio project to an existing WooCommerce product.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

const PORTFOLIO_LETIZIA_LINKED_PRODUCT_META = 'linked_product_id';

add_action(
	'init',
	static function (): void {
		register_post_meta(
			'post',
			PORTFOLIO_LETIZIA_LINKED_PRODUCT_META,
			array(
				'type'              => 'integer',
				'single'            => true,
				'default'           => 0,
				'sanitize_callback' => 'absint',
				'auth_callback'     => static fn (): bool => current_user_can( 'edit_posts' ),
				'show_in_rest'      => true,
			)
		);
	}
);

add_action(
	'rest_api_init',
	static function (): void {
		register_rest_field(
			'post',
			PORTFOLIO_LETIZIA_LINKED_PRODUCT_META,
			array(
				'get_callback' => static function ( array $post ): ?int {
					$product_id = absint( get_post_meta( $post['id'], PORTFOLIO_LETIZIA_LINKED_PRODUCT_META, true ) );
					return $product_id > 0 ? $product_id : null;
				},
				'schema'       => array(
					'description' => 'WooCommerce product linked to this project.',
					'type'        => array( 'integer', 'null' ),
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
			)
		);
	}
);

add_action(
	'add_meta_boxes_post',
	static function (): void {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		add_meta_box(
			'portfolio-letizia-linked-product',
			__( 'Prodotto WooCommerce collegato', 'portfolio-letizia' ),
			'portfolio_letizia_render_product_link_metabox',
			'post',
			'side',
			'default'
		);
	}
);

function portfolio_letizia_render_product_link_metabox( WP_Post $post ): void {
	wp_nonce_field( 'portfolio_letizia_save_product_link', 'portfolio_letizia_product_link_nonce' );
	$selected = absint( get_post_meta( $post->ID, PORTFOLIO_LETIZIA_LINKED_PRODUCT_META, true ) );
	$products = get_posts(
		array(
			'post_type'      => 'product',
			'post_status'    => array( 'publish', 'draft', 'private' ),
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
		)
	);
	?>
	<p><?php esc_html_e( 'Lascia vuoto per un progetto non acquistabile.', 'portfolio-letizia' ); ?></p>
	<select name="portfolio_letizia_linked_product_id" id="portfolio-letizia-linked-product" style="width:100%">
		<option value=""><?php esc_html_e( 'Nessun prodotto', 'portfolio-letizia' ); ?></option>
		<?php foreach ( $products as $product ) : ?>
			<option value="<?php echo esc_attr( (string) $product->ID ); ?>" <?php selected( $selected, $product->ID ); ?>>
				<?php echo esc_html( sprintf( '%s (#%d)', get_the_title( $product ), $product->ID ) ); ?>
			</option>
		<?php endforeach; ?>
	</select>
	<?php
}

add_action(
	'save_post_post',
	static function ( int $post_id ): void {
		$nonce = isset( $_POST['portfolio_letizia_product_link_nonce'] )
			? sanitize_text_field( wp_unslash( $_POST['portfolio_letizia_product_link_nonce'] ) )
			: '';

		if ( ! wp_verify_nonce( $nonce, 'portfolio_letizia_save_product_link' )
			|| ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
			|| ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$product_id = isset( $_POST['portfolio_letizia_linked_product_id'] )
			? absint( wp_unslash( $_POST['portfolio_letizia_linked_product_id'] ) )
			: 0;

		if ( $product_id > 0 && 'product' === get_post_type( $product_id ) ) {
			update_post_meta( $post_id, PORTFOLIO_LETIZIA_LINKED_PRODUCT_META, $product_id );
			return;
		}

		delete_post_meta( $post_id, PORTFOLIO_LETIZIA_LINKED_PRODUCT_META );
	}
);
