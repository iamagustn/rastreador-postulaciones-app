interface Props {
    error: string | null
    idError: string | null
}

function MensajeError({ error, idError }: Props) {
    
    return (
        <div>
            <p>Ocurrió un error: {error}</p>
            {idError && <p>ID del error: {idError}</p>}
        </div>
    )
}

export default MensajeError;