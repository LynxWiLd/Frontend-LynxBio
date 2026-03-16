import { Draggable } from "@hello-pangea/dnd"; // 👈 El motor del movimiento
import { ListGroup, Button } from "react-bootstrap";
import { FaTrashAlt, FaExternalLinkAlt, FaGlobe, FaGripVertical } from "react-icons/fa";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const LinkItem = ({ link, index, handleDeleteLink }) => {
  return (
    <Draggable draggableId={link._id} index={index}>
      {(provided, snapshot) => (
        <ListGroup.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          /* Aplicamos una clase especial si se está arrastrando */
          className={`${styles.linkItem} ${snapshot.isDragging ? styles.isDragging : ""}`}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              
              {/* 🖱️ EL MANUBRIO: Desde acá se agarra el link para moverlo */}
              <div 
                {...provided.dragHandleProps} 
                className={styles.dragHandle}
                title="Arrastra para reordenar"
              >
                <FaGripVertical />
              </div>

              {/* ICONO DEL LINK */}
              <div className="fs-4 text-primary d-flex align-items-center">
                {ICON_MAP[link.icon] || <FaGlobe />}
              </div>

              {/* TEXTOS */}
              <div className="d-flex flex-column">
                <h6 className="mb-0 fw-bold">{link.title}</h6>
                <small className={styles.linkUrl}>
                  <FaExternalLinkAlt className="me-1" size={10} />
                  {link.url}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* INDICADOR DE COLOR */}
              <div
                className={styles.statusIndicator}
                style={{ backgroundColor: link.buttonColor }}
                title="Color del botón"
              />

              {/* BOTÓN ELIMINAR */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteLink(link._id)}
                className="rounded-circle shadow-sm"
              >
                <FaTrashAlt />
              </Button>
            </div>
          </div>
        </ListGroup.Item>
      )}
    </Draggable>
  );
};

export default LinkItem;