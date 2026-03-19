import { Draggable } from "@hello-pangea/dnd";
import { ListGroup, Button } from "react-bootstrap";
import { FaTrashAlt, FaExternalLinkAlt, FaGlobe, FaGripVertical } from "react-icons/fa";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const LinkItem = ({ link, index, handleDeleteLink }) => {
  // 🪄 FIX: Extraemos el componente del mapa para renderizarlo correctamente
  const LinkIcon = ICON_MAP[link.icon] || FaGlobe;

  return (
    <Draggable draggableId={link._id} index={index}>
      {(provided, snapshot) => (
        <ListGroup.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          /* 🎨 Agregamos clase de 'dragging' para efecto visual pro */
          className={`${styles.linkItem} ${snapshot.isDragging ? styles.isDragging : ""}`}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3 w-75">
              
              {/* 🖱️ MANUBRIO (Handle) */}
              <div 
                {...provided.dragHandleProps} 
                className={styles.dragHandle}
                title="Arrastra para reordenar"
                aria-label="Mover enlace"
              >
                <FaGripVertical />
              </div>

              {/* ICONO - Renderizado como componente */}
              <div className="fs-4 text-primary d-flex align-items-center flex-shrink-0">
                <LinkIcon />
              </div>

              {/* TEXTOS - Con truncado de seguridad */}
              <div className="d-flex flex-column text-truncate">
                <h6 className="mb-0 fw-bold text-truncate">{link.title}</h6>
                <small className={`${styles.linkUrl} text-truncate d-block`}>
                  <FaExternalLinkAlt className="me-1" size={10} />
                  {link.url}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* INDICADOR DE COLOR (Preview del botón real) */}
              <div
                className={styles.statusIndicator}
                style={{ 
                  backgroundColor: link.buttonColor,
                  border: `1px solid ${link.buttonTextColor}` 
                }}
                title={`Fondo: ${link.buttonColor} | Texto: ${link.buttonTextColor}`}
              />

              {/* BOTÓN ELIMINAR */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteLink(link._id)}
                className="rounded-circle shadow-sm p-2"
                aria-label={`Eliminar enlace ${link.title}`}
              >
                <FaTrashAlt size={14} />
              </Button>
            </div>
          </div>
        </ListGroup.Item>
      )}
    </Draggable>
  );
};

export default LinkItem;