import "./style.css"
import ImgGb from "../Images/LOGOGBONLINE.png"

function Components () {
    return (
    <div className="container-master">
        <div className="navbar">
            <div className="flex">
            <img src={ImgGb} className="logo" alt="gb" />
            <div className="treinamento-mateus">
            <div className="teste-gb">
            <p>Teste - Analista de Desenvolvimento</p>
            <div className="teste-gb-subtitle">
            <p>Mateus Prudente</p>
            </div>
            </div>
        </div>    
        </div>
        </div>
      
    </div>
        
    )
}

export default Components