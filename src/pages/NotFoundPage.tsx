import {Link} from "react-router-dom"
import "../styles/NotFoundPage.css"

const NotFoundPage = () => {
  return (
    <div  className="container">
      <h1>
        Error 404: Page not Found
      </h1>
      <Link to = {"/"}>
          <div className="d-grid gap-2 d-md-block">
            <button className="btn btn-danger" type="button">Volver al Inicio</button>
          </div>
      </Link>
    </div>
  )
}

export default NotFoundPage