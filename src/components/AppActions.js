import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const AppActions = () => {
  
    function openFullscreen() {
        const elem = document.querySelector(".app");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    return (
        <div className="app__actions">
            <div className="options">
              <span onClick={openFullscreen}><FontAwesomeIcon className="icon" icon={faExpandAlt} />Fullscreen</span>
              <span><FontAwesomeIcon className="icon" icon={faPlusCircle} />Compare</span>
            </div>
        
            <div className="time">
              <span>1d</span>
              <span>3d</span>
              <span className="time__clicked">1w</span>
              <span>1m</span>
              <span>6m</span>
              <span>1y</span>
              <span>max</span>
            </div>
        </div>
    )
}

export default AppActions;
