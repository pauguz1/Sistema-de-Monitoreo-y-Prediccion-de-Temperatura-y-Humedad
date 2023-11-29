


function mostrarModalEfimero(info){
    let modal = document.createElement('div');
    modal.id = 'modal-info';
    modal.classList.add('fondo-modal');
    modal.innerHTML = `
        <div>
            <label>${info}</label>
        </div>
    `;
    //agregamos el modal al body
    document.body.appendChild(modal);
    setTimeout(function(){
        document.getElementById(modal.id).remove();
    },(info.length*64) );
}