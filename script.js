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

const btn = document.querySelector('#btnMenu')
const nav = document.querySelector('nav')
const body = document.querySelector('body')
let menu = 0

body.onclick = () => {
    menu++
    //console.log('body',menu)
    if(menu > 2) {
        btn.style.display = 'block'
        nav.style.display = 'none'
        menu = 0
    }
}
btn.onclick = () => {
    ++menu
    //console.log('btn',menu)
    btn.style.display = 'none'
    nav.style.display = 'block'
}
