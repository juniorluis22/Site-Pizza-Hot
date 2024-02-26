document.addEventListener("DOMContentLoaded", function() {
let cart = []
let modalQt = 1
let modalKey = 0

const c = (el)=>document.querySelector(el)
const cALL = (el)=>document.querySelectorAll(el)


let totalSlides = document.querySelectorAll('.slider--item').length
let currentSlide =  0


// SLIDER

function goPrev(){
    currentSlide--
    if(currentSlide < 0){
        currentSlide = totalSlides - 1
    }
    updateMargin()
}

function goNext(){
    currentSlide++
    if(currentSlide > (totalSlides-1)){
        currentSlide = 0
    }
    updateMargin()
}

function updateMargin(){
    let sliderItemWidth = document.querySelector('.slider--item').clientWidth
    let newMargin = (currentSlide * sliderItemWidth)
    document.querySelector('.slider--width').style.marginLeft = `-${newMargin}px`

}

setInterval(goNext, 5000)

    // LISTAEM DAS PIZZAS
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true)
    // preenchere as informaçõesem pizzaItem

    // colocar um atributo 
    pizzaItem.setAttribute('data-key', index)

    // Imagem das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    // Nome das pizzas
    pizzaItem.querySelector('.pizza-item--name').innerHTML= item.name

    // Valores das pizzas
    pizzaItem.querySelector('.pizza-item--price').innerHTML= `${item.price[2].toFixed(2)} R$`

    // Descrição das pizzas
    pizzaItem.querySelector('.pizza-item--desc').innerHTML= item.description
    
    // Click na pizza
    pizzaItem.querySelector('a').addEventListener('click',(e)=> {
        e.preventDefault()

        // pizzas selecionadas
        let key = e.target.closest('.pizza-item').getAttribute('data-key')

        // Resetar o modal para  1
        modalQt = 1
        modalKey = key

        // Preencher pizzas 
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[2].toFixed(2)} R$`
        
         // Remover  o  selected
        c('.pizzaInfo--size.selected').classList.remove('selected')
         
         
        cALL('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected')
            }
            size.addEventListener('click', ()=>{
               
                switch (sizeIndex ) {
                    case 0: 
                       c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[0].toFixed(2)} R$`
                        break;
    
                     case 1: 
                     
                        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[1].toFixed(2)} R$`
                        break;
    
                    case 2: 
                        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[2].toFixed(2)} R$`
                        break;
    
                    default:
                        break;
                }
    
            })
          
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            
        })
       
        
            // Quantidade de pizzas
            c('.pizzaInfo--qt').innerHTML = modalQt

        
        // Tempo da  transição do modal na tela
        c('.pizzaWindowArea').style.opacity = '0'
        c('.pizzaWindowArea').style.display = 'flex'

        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1'
        }, 200)
    })
    
    // ADD pizzas na area
    c('.pizza-area').append(pizzaItem)
    
})

// ABRIR MENU LATERAL

let btnMenu = document.querySelector('#menu-btn-open')
let menuNavMobile = document.querySelector('#menu-nav-open')
let overlayMenu = document.querySelector('#overlay-menu')

btnMenu.addEventListener('click',()=>{
    menuNavMobile.classList.add('open-menu-mobile')
})

menuNavMobile.addEventListener('click',()=>{
    menuNavMobile.classList.remove('open-menu-mobile') 
})

overlayMenu.addEventListener('click',()=>{
    menuNavMobile.classList.remove('open-menu-mobile') 
})




//EVENTOS DO MODAL

function fecharModal(){
    c('.pizzaWindowArea').style.opacity = '0'
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

cALL('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', fecharModal)
})

// Botao de mais e menos 

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt
    }
})

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
})
    
// Seletor do tamanho da pizza

cALL('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
      // Remover a classe 'selected' de todos os tamanhos antes de adicionar ao clicado
      cALL('.pizzaInfo--size').forEach((s) => s.classList.remove('selected'));
  
      // Adicionar a classe 'selected' ao tamanho clicado
      size.classList.add('selected');
    });
  });

// Indentificador de pizzas
 
c('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identificador = pizzaJson[modalKey].id+ '@' + size
    
    let key = cart.findIndex((item)=>{
        return item.identificador == identificador
    })

    if(key > -1){
        cart[key].qt += modalQt

    }else{
        cart.push({
            identificador,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
           })
    }
   updateCart()
   fecharModal()
})     

    // Menu do carrinho
    c('.menu-openner').addEventListener('click', ()=>{
        if(cart.length > 0 ){
            c('aside').style.left= '0'
        } 
    })
    // Fechar carrinho 
    c('.menu-closer ').addEventListener('click', ()=>{
        c('aside').style.left= '100vw'

    })


    // Preenchendo carrinho
function updateCart (){
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
            

            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    subtotal += pizzaItem.price[0]* cart[i].qt
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    subtotal += pizzaItem.price[1]* cart[i].qt
                    break
                    
                case 2: 
                    subtotal += pizzaItem.price[2]* cart[i].qt
                    pizzaSizeName = 'G'
                    break    
            
                default:
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            // Quantidades adicionada no carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart()

            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                }else{
                    cart.splice(i, 1)
                }
                updateCart()
                
            })
            c('.cart').append(cartItem)
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML= `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML= `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML= `R$ ${total.toFixed(2)}`

    } else{
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'

    }

} 
   
});
