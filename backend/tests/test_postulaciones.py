def test_crear_postulacion_tiene_fila_en_historial(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "prueba",
        "fecha_postulacion": "2022-01-01"
    })                         
    id_postulacion = postulacion.json()["id"]

    respuesta = cliente.get(f"/postulaciones/{id_postulacion}/historial", headers=cabecera)
    historial = respuesta.json()
    assert len(historial) == 1

def test_usuario_ajeno_no_puede_ver_historial_editar_borrar_la_de_otro_responde_404(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    # Crear la postulacion y extraer su id para usarlo en las pruebas
    postulacion = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "prueba",
        "fecha_postulacion": "2022-01-01" 
    })
    id_postulacion = postulacion.json()["id"]

    cliente.post("/usuarios", json={
        "nombre": "usuario",
        "apellidos": "pruebas",
        "correo": "usuario@test.com",
        "contrasena": "contrasena123"
    })

    # Extraer el token para mandarlo en la cabecera en las pruebas
    login = cliente.post("/login", json={
        "correo": "usuario@test.com",
        "contrasena": "contrasena123"
    })
    token_usuario = login.json()["access_token"]

    # PRUEBAS A EVALUAR
    traer_postulacion = cliente.get(f"/postulaciones/{id_postulacion}", headers={"Authorization": f"Bearer {token_usuario}"})
    actualizar_postulaciones = cliente.patch(f"/postulaciones/{id_postulacion}", headers={"Authorization": f"Bearer {token_usuario}"}, json={
        "puesto": "QA"
    })
    borrar_postulacion = cliente.delete(f"/postulaciones/{id_postulacion}", headers={"Authorization": f"Bearer {token_usuario}"})
    traer_historial = cliente.get(f"/postulaciones/{id_postulacion}/historial", headers={"Authorization": f"Bearer {token_usuario}"})

    assert traer_postulacion.status_code == 404
    assert actualizar_postulaciones.status_code == 404
    assert borrar_postulacion.status_code == 404
    assert traer_historial.status_code == 404

def test_crear_empresa_con_caracteres_diferentes_es_una_misma_empresa(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}

    # Crear las postulaciones y guardar la informacion de las empresas, posteriormente comparar el id de la empresa uno con la empresa dos
    postulacion_uno = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    portal_uno = postulacion_uno.json()["empresa"]
    postulacion_dos = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "nExUs",
        "fecha_postulacion": "2022-01-01"
    })
    empresa_dos = postulacion_dos.json()["empresa"]

    assert portal_uno["id"] == empresa_dos["id"]

def test_borrar_postulacion_limpia_historial_404(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "nExUs",
        "fecha_postulacion": "2022-01-01"
    })
    id_postulacion = postulacion.json()["id"]

    cliente.delete(f"/postulaciones/{id_postulacion}", headers=cabecera)
    respuesta = cliente.get(f"/postulaciones/{id_postulacion}/historial", headers=cabecera)
    
    assert respuesta.status_code == 404

def test_patch_estado_agrega_fila(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "prueba",
        "fecha_postulacion": "2022-01-01" 
    })
    id_postulacion = postulacion.json()["id"]
    patch = cliente.patch(f"/postulaciones/{id_postulacion}/estado", headers=cabecera, json={
        "estado": "rechazado"
    })
    
    historial_postulacion = cliente.get(f"/postulaciones/{id_postulacion}/historial", headers=cabecera)
    historial_json = historial_postulacion.json()

    assert patch.status_code == 200
    assert len(historial_json) == 2

def test_patch_de_un_solo_campo_deja_los_demas_intactos(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}

    postulacion_creada = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    postulacion_creada_json = postulacion_creada.json()

    patch = cliente.patch(f"/postulaciones/{postulacion_creada_json["id"]}", headers=cabecera, json={
        "puesto": "prueba2",
    })

    postulacion_afectada = cliente.get(f"/postulaciones/{postulacion_creada_json["id"]}", headers=cabecera)
    postulacion_afectada_json = postulacion_afectada.json()

    assert patch.status_code == 200
    assert postulacion_creada_json["empresa"] == postulacion_afectada_json["empresa"]
    assert postulacion_creada_json["fecha_postulacion"] == postulacion_afectada_json["fecha_postulacion"]
    assert postulacion_afectada_json["puesto"] == "prueba2"

def test_patch_campo_desconocido_responde_422(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion_creada = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    id_postulacion = postulacion_creada.json()["id"]

    patch_postulacion = cliente.patch(f"/postulaciones/{id_postulacion}", headers=cabecera, json={
        "estado": "inexistente",
    })

    assert patch_postulacion.status_code == 422

def test_patch_estado_desconocido_responde_422(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion_creada = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    id_postulacion = postulacion_creada.json()["id"]

    patch_postulacion = cliente.patch(f"/postulaciones/{id_postulacion}/estado", headers=cabecera, json={
        "estado": "inexistente",
    })

    assert patch_postulacion.status_code == 422

def test_patch_mercado_inexistente_responde_422(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion_creada = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    id_postulacion = postulacion_creada.json()["id"]

    patch_postulacion = cliente.patch(f"/postulaciones/{id_postulacion}", headers=cabecera, json={
        "mercado_id": 999,
    })

    assert patch_postulacion.status_code == 422

def test_patch_modalidad_inexistente_responde_422(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}
    postulacion_creada = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "NEXUS",
        "fecha_postulacion": "2022-01-01"
    })
    id_postulacion = postulacion_creada.json()["id"]

    patch_postulacion = cliente.patch(f"/postulaciones/{id_postulacion}", headers=cabecera, json={
        "modalidad_id": 999,
    })

    assert patch_postulacion.status_code == 422

def test_crear_portal_con_caracteres_diferentes_es_un_mismo_portal(cliente, token):
    cabecera = {"Authorization": f"Bearer {token}"}

    postulacion_uno = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "nexus",
        "portal": "Indeed",
        "fecha_postulacion": "2022-01-01"
    })
    portal_uno = postulacion_uno.json()["portal"]

    postulacion_dos = cliente.post("/postulaciones", headers=cabecera, json={
        "puesto": "prueba",
        "empresa": "nexus",
        "portal": "indeed",
        "fecha_postulacion": "2022-01-01"
    })
    portal_dos = postulacion_dos.json()["portal"]

    assert portal_uno["id"] == portal_dos["id"]