const h2 = document.querySelectorAll('h2 > a')

window.onscroll = function(e){
    console.clear()
    h2.forEach(function (e) {
        if((scrollY+165) > e.offsetTop && scrollY < (e.offsetTop + e.parentElement.parentElement.offsetHeight-120)){
            const getId = '#' + e.id
            document.querySelector(`#nav > a[href="${getId}"]`).classList.add('selected')
        }else{
            const getId = '#' + e.id
            document.querySelector(`#nav > a[href="${getId}"]`).classList.remove('selected')
        }
    })
}