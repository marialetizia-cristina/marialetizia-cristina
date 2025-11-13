// Componente che accetta componenti come props
interface LayoutProps {
  header: React.ReactNode
  main: React.ReactNode
  footer: React.ReactNode
}

const Layout = ({ header, main, footer }: LayoutProps) => {
  return (
    <div className="layout">
      <header className="layout-header">{header}</header>
      <div className="layout-content">
        <main className="layout-main">{main}</main>
      </div>
      <footer className="layout-footer">{footer}</footer>
    </div>
  )
}

export default Layout