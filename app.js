const PRODUCTS = [
  {id:1,name:'كان لك معايا',desc:'Exploring repetition and rhythm through Arabic letterforms and visual structure.',image:'assets/artwork/artwork-1.jpg',thumb:'assets/collection/collection-1.jpg'},
  {id:2,name:'عمّان',desc:'A geometric study of Arabic type inspired by the visual character of Amman.',image:'assets/artwork/artwork-8.jpg',thumb:'assets/collection/collection-2.jpg'},
  {id:3,name:'الدار أمان',desc:'Exploring Arabic letterforms through contrast, proportion, and geometric rhythm.',image:'assets/artwork/artwork-2.jpg',thumb:'assets/collection/collection-3.jpg'},
  {id:4,name:'سعادة الريس',desc:'A bold typographic composition exploring rhythm, scale, and expressive Arabic forms.',image:'assets/artwork/artwork-3.jpg',thumb:'assets/collection/collection-4.jpg'},
  {id:5,name:'الجمال',desc:'A bold interpretation of Arabic typography, reduced to its essential geometric forms.',image:'assets/artwork/artwork-5.jpg',thumb:'assets/collection/collection-5.jpg'},
  {id:6,name:'صبر أيوب',desc:'A study of Arabic typography through structure, movement, and layered forms.',image:'assets/artwork/artwork-6.jpg',thumb:'assets/collection/collection-6.jpg'},
  {id:7,name:'العودة',desc:'A minimal exploration of Arabic type through balance, weight, and negative space.',image:'assets/artwork/artwork-7.jpg',thumb:'assets/collection/collection-7.jpg'},
  {id:8,name:'فراغ',desc:'An exploration of Arabic type and negative space through circular forms and repetition.',image:'assets/artwork/artwork-4.jpg',thumb:'assets/collection/collection-8.jpg'}
];
const A3=18,A1=28,DELIVERY=3;
let cart=JSON.parse(localStorage.getItem('frameco-cart')||'[]');
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function money(n){return `${n} JD`}
function save(){localStorage.setItem('frameco-cart',JSON.stringify(cart));renderCart();}
function renderCollection(){
  const grid=$('#collection-grid');
  grid.innerHTML=PRODUCTS.map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-image"><img src="${p.thumb}" alt="${p.name}"></div><div class="product-meta"><span>${p.name}</span><span>FROM ${A3} JD</span></div></article>`).join('');
  $$('.product-card').forEach(c=>c.addEventListener('click',()=>openProduct(+c.dataset.id)));
}
function openProduct(id){
 const p=PRODUCTS.find(x=>x.id===id); if(!p)return;
 $('#product-modal').innerHTML=`<div class="product-modal-inner"><button class="close" data-close>×</button><div class="product-detail"><div class="detail-copy"><div class="eyebrow">PRODUCT | ARTWORK PAGE</div><h2>${p.name}</h2><p>${p.desc}</p><div class="size-label">Size</div><div class="sizes"><button class="size active" data-size="A3">A3 <span>29.7 × 42 cm</span><strong>${A3} JD</strong></button><button class="size" data-size="A1">A1 <span>59.4 × 84.1 cm</span><strong>${A1} JD</strong></button></div><button class="primary add" data-add="${p.id}">ADD TO CART</button></div><div class="detail-image"><img src="${p.image}" alt="${p.name}"></div></div></div>`;
 $('#product-modal').classList.add('active');
 $('[data-close]').onclick=()=>$('#product-modal').classList.remove('active');
 $$('.size').forEach(b=>b.onclick=()=>{$$('.size').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
 $('.add').onclick=()=>{const size=$('.size.active').dataset.size; addToCart(id,size);$('#product-modal').classList.remove('active');openCart()};
}
function addToCart(id,size){const x=cart.find(i=>i.id===id&&i.size===size);x?x.qty++:cart.push({id,size,qty:1});save()}
function removeItem(id,size){cart=cart.filter(i=>!(i.id===id&&i.size===size));save()}
function renderCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0); $('#cart-count').textContent=count; const dc=$('#drawer-cart-count'); if(dc) dc.textContent=count;
 $('#cart-items').innerHTML=cart.length?cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id),price=i.size==='A1'?A1:A3;return `<div class="cart-item"><img src="${p.thumb}" alt="${p.name}"><div><strong>${p.name}</strong><span>${i.size} — ${money(price)}</span><span>Qty: ${i.qty}</span><button class="remove" data-id="${i.id}" data-size="${i.size}">REMOVE</button></div><b>${money(price*i.qty)}</b></div>`}).join(''):'<p class="empty">Your cart is empty.</p>';
 $$('.remove').forEach(b=>b.onclick=()=>removeItem(+b.dataset.id,b.dataset.size));
 const subtotal=cart.reduce((s,i)=>s+(i.size==='A1'?A1:A3)*i.qty,0), total=cart.length?subtotal+DELIVERY:0;
 $('#subtotal').textContent=money(subtotal); $('#total').textContent=money(total); $('#checkout-total').textContent=money(total); const cb=$('#checkout-total-button'); if(cb) cb.textContent=money(total);
}
function openCart(){ $('#cart').classList.add('active'); }
function closeCart(){ $('#cart').classList.remove('active'); }
function openCheckout(){if(!cart.length)return; closeCart(); const ci=$('#checkout-items'); if(ci) ci.innerHTML=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id),price=i.size==='A1'?A1:A3; return `<div class=\"checkout-line\"><span>${p.name} · ${i.size} × ${i.qty}</span><b>${money(price*i.qty)}</b></div>`}).join(''); $('#checkout').classList.add('active');}
function closeCheckout(){ $('#checkout').classList.remove('active'); }
function placeOrder(e){e.preventDefault();if(!cart.length)return;const num='#'+String(Math.floor(10000+Math.random()*90000));const subtotal=cart.reduce((s,i)=>s+(i.size==='A1'?A1:A3)*i.qty,0),total=subtotal+DELIVERY;$('#order-number').textContent=num;$('#payment-total').textContent=money(total).replace(' JD',' JOD');$('#payment-reference').textContent=`ORDER ${num}`;closeCheckout();$('#payment').classList.add('active');}
function completePayment(){cart=[];save();$('#payment').classList.remove('active');$('#success').classList.add('active')}
function closeOverlay(id){$(id).classList.remove('active')}
document.addEventListener('DOMContentLoaded',()=>{
 renderCollection();renderCart();
 $('#cart-open').onclick=openCart;$('#cart-close').onclick=closeCart;$('#checkout-open').onclick=openCheckout;$('#checkout-close').onclick=closeCheckout;
 $('#checkout-form').addEventListener('submit',placeOrder);$('#payment-done').onclick=completePayment; const copy=$('.cliq-box button'); if(copy) copy.onclick=()=>navigator.clipboard&&navigator.clipboard.writeText('FRAMECOST');$('#success-close').onclick=()=>closeOverlay('#success');
 $('#product-modal').addEventListener('click',e=>{if(e.target.id==='product-modal')closeOverlay('#product-modal')});
 $('#menu').onclick=()=>document.body.classList.toggle('nav-open');
});
