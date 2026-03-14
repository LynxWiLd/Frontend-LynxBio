import { ListGroup, Button } from 'react-bootstrap';
import { FaTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const LinkItem = ({ link, handleDeleteLink }) => (
  <ListGroup.Item className={styles.linkItem}>
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex flex-column">
        <h6 className="mb-0 fw-bold">{link.title}</h6>
        <small className={styles.linkUrl}>
          <FaExternalLinkAlt className="me-1" size={10} />
          {link.url}
        </small>
      </div>
      
      <div className="d-flex align-items-center gap-3">
        {/* El indicador del color que eligió el usuario */}
        <div 
          className={styles.statusIndicator} 
          style={{ backgroundColor: link.buttonColor }} 
          title="Color del botón"
        />
        
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
);

export default LinkItem;