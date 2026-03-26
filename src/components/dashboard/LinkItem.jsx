import { Draggable } from "@hello-pangea/dnd";
import { ListGroup, Button } from "react-bootstrap";
import {
  FaTrashAlt,
  FaExternalLinkAlt,
  FaGlobe,
  FaGripVertical,
} from "react-icons/fa";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "./LinkItem.module.css"; // 🪄 Corregido el path

const LinkItem = ({ link, index, handleDeleteLink }) => {
  const LinkIcon = ICON_MAP[link.icon] || FaGlobe;

  return (
    <Draggable draggableId={link._id} index={index}>
      {(provided, snapshot) => (
        <ListGroup.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.linkItem} ${snapshot.isDragging ? styles.isDragging : ""}`}
        >
          <div className="d-flex justify-content-between align-items-center gap-2">
            {/* IZQUIERDA: ICONOS Y TEXTO */}
            <div className="d-flex align-items-center gap-3 w-75 min-width-0">
              {/* MANUBRIO */}
              <div
                {...provided.dragHandleProps}
                className={styles.dragHandle}
                title="Arrastra para reordenar"
              >
                <FaGripVertical />
              </div>

              {/* ICONO RED SOCIAL */}
              <div className="fs-4 text-primary d-flex align-items-center flex-shrink-0">
                <LinkIcon />
              </div>

              {/* CONTENEDOR DE TEXTO (Truncado Seguro) */}
              <div className={styles.textWrapper}>
                <h6 className={styles.linkTitle}>{link.title}</h6>
                <small className={styles.linkUrl}>
                  <FaExternalLinkAlt className="me-1" size={10} />
                  {link.url}
                </small>
              </div>
            </div>

            {/* DERECHA: ESTÉTICA Y ACCIONES */}
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              <div
                className={styles.statusIndicator}
                style={{
                  backgroundColor: link.buttonColor,
                  border: `1px solid ${link.buttonTextColor}`,
                }}
                title={`Fondo: ${link.buttonColor} | Texto: ${link.buttonTextColor}`}
              />

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteLink(link._id)}
                className="rounded-circle shadow-sm p-2 border-0"
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
