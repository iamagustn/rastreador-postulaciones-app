import { useState } from "react"
import Login from "./paginas/Login"
import ListarPostulaciones from "./paginas/ListarPostulaciones"
import Registro from "./paginas/Registro"
import NuevaPostulacion from "./paginas/NuevaPostulacion"
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import RutaProtegida from "./componentes/RutaProtegida"
import { useAuth } from "./contextos/AuthContexto"
import DetallePostulacion from "./paginas/DetallePostulacion"
import EditarPostulacion from "./paginas/EditarPostulacion"
import PantallaVacia from "./componentes/PantallaVacia"

function App() {

  const [contador, setContador] = useState(0)
  const { token, removerToken } = useAuth()

  const [menuAbierto, setMenuAbierto] = useState(false)

  function subirContador() {
    setContador((valorAnterior) => valorAnterior + 1)
  }

  return (
    <>
    <nav className="bg-marino text-white p-4 flex flex-wrap items-center justify-between gap-4">

        <Link to="/" className="font-bold text-lg" onClick={() => setMenuAbierto(false)}>
          <span className="md:hidden">Rastreador</span>
          <span className="hidden md:inline">Rastreador de Postulaciones</span>
        </Link>

      <div className={`${menuAbierto ? "flex" : "hidden"} md:flex w-full md:w-auto flex-col md:flex-row gap-4`}>
        {token && (
          <Link to="/postulaciones" className="inline-flex items-center gap-1" onClick={() => setMenuAbierto(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5">
              <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            Mis postulaciones
          </Link>)}

        {token && (
          <Link to="/postulaciones/nueva" className="inline-flex items-center gap-1" onClick={() => setMenuAbierto(false)}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4.5">
              <path strokeLinecap="round" strokeLinejoin="round"d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Nueva postulación
          </Link>)}

      
        {token && (
          <button onClick={removerToken} className="inline-flex items-center gap-1">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
            </svg>
            Cerrar sesión
          </button>
        )}
      </div>

      {/* Menu de 3 barras para pantallas de movil */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="md:hidden"
        aria-label="menu"
      >
        <svg  fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5">
          <path strokeLinecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

    </nav>

    <main className="max-w-4xl mx-auto p-4">
      <Routes>

        <Route path="/registro" element={<Registro/>}/>
        <Route path="/login" element={<Login />}/>

        <Route path="/postulaciones" element={
          <RutaProtegida>
            <ListarPostulaciones contador={contador}/>
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/nueva" element={
          <RutaProtegida>
            <NuevaPostulacion subirContador={subirContador}/>
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/:id" element={
          <RutaProtegida>
            <DetallePostulacion />
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/:id/editar" element={
          <RutaProtegida>
            <EditarPostulacion />
          </RutaProtegida>
        }/>

        <Route
          path="*"
          element={
            <PantallaVacia 
              titulo="La pagina no existe"
              descripcion="La ruta que buscas no esta disponible"
              icono={
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-texto-suave">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                </svg>
              }
            />
          }
        />

        <Route path="/" element={token ? <Navigate to="/postulaciones"/> : <Navigate to="/login"/>}/>

      </Routes>
    </main>

    </>
  )
}

export default App
