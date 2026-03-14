import { ListGroup, Button } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const LinkItem = ({ link, handleDeleteLink }) => (
  <ListGroup.Item className={styles.linkItem}>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h6 className="mb-0 fw-bold">{link.title}</h6>
        <small className="text-muted">{link.url}</small>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className={styles.statusIndicator} style={{ backgroundColor: link.buttonColor }} />
        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLink(link._id)} className="rounded-circle">
          <FaTrashAlt />
        </Button>
      </div>
    </div>
  </ListGroup.Item>
);

export default LinkItem;