const products = window.SCALE_STREET_PRODUCTS || [];
const config = window.SCALE_STREET_CONFIG || {whatsappNumber:"",upiId:"",currency:"₹"};
let cart = JSON.parse(localStorage.getItem("scaleStreetCart") || "[]");

const $ = s => document.querySelector(s);
const money = n => `${config.currency}${Number(n).toLocaleString("en-IN")}`;

function saveCart(){ localStorage.setItem("scaleStreetCart", JSON.stringify(cart)); renderCart(); }
function getProduct(id){ return products.find(p => p.id === id); }

function renderProducts(){
  const grid=$("#productGrid"), empty=$("#emptyState");
  const q=($("#search")?.value||"").toLowerCase().trim();
  const cat=$("#categoryFilter")?.value||"all";
  const list=products.filter(p=>
    (!q || [p.name,p.brand,p.category,p.scale].join(" ").toLowerCase().includes(q)) &&
    (cat==="all" || p.category===cat)
  );
  grid.innerHTML="";
  empty.classList.toggle("hidden", list.length!==0);
  list.forEach((p,i)=>{
    const card=document.createElement("article");
    card.className="product-card";
    card.innerHTML=`<div class="product-image"><img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy"></div>
      <div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="muted">${escapeHtml(p.brand||"")} ${p.scale?`• ${escapeHtml(p.scale)}`:""}</div>
      <div class="price">${money(p.price)}</div><div class="stock-badge ${Number(p.stock)>0?"in-stock":"out-stock"}">${Number(p.stock)>0?"In Stock":"Out Of Stock"}</div></div>`;
    card.addEventListener("click",()=>openProduct(p.id));
    grid.appendChild(card);
    setTimeout(()=>card.classList.add("visible"),i*70);
  });
}
function renderCategories(){
  const select=$("#categoryFilter"); if(!select)return;
  [...new Set(products.map(p=>p.category).filter(Boolean))].sort().forEach(c=>{
    const o=document.createElement("option");o.value=c;o.textContent=c;select.appendChild(o);
  });
}
function renderCart(){
  const box=$("#cartItems"), count=$("#cartCount"), total=$("#cartTotal");
  const items=cart.map(x=>({...x,p:getProduct(x.id)})).filter(x=>x.p);
  count.textContent=cart.reduce((a,x)=>a+x.qty,0);
  box.innerHTML=items.length?items.map(x=>`<div class="cart-item">
    <img src="${escapeAttr(x.p.image)}" alt="">
    <div><h4>${escapeHtml(x.p.name)}</h4><div class="muted">${money(x.p.price)} each</div>
      <div class="qty"><button onclick="changeQty('${x.p.id}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.p.id}',1)">+</button></div>
    </div><button class="qty remove" onclick="removeItem('${x.p.id}')">×</button>
  </div>`).join(""):`<div class="empty">Your cart is empty.</div>`;
  total.textContent=money(items.reduce((a,x)=>a+x.p.price*x.qty,0));
}
function addToCart(id){
  const p=getProduct(id); if(!p || Number(p.stock)<=0)return;
  const found=cart.find(x=>x.id===id);
  if(found){ if(found.qty<Number(p.stock))found.qty++; }
  else cart.push({id,qty:1});
  saveCart(); openCart();
}
function changeQty(id,d){
  const item=cart.find(x=>x.id===id),p=getProduct(id);if(!item||!p)return;
  item.qty=Math.max(0,Math.min(Number(p.stock),item.qty+d));
  cart=cart.filter(x=>x.qty>0);saveCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function openCart(){ $("#cartPanel").classList.add("open");$("#backdrop").classList.add("show");$("#cartPanel").setAttribute("aria-hidden","false"); }
function closeCart(){ $("#cartPanel").classList.remove("open");$("#backdrop").classList.remove("show");$("#cartPanel").setAttribute("aria-hidden","true"); }
function openProduct(id){
  const p=getProduct(id);if(!p)return;
  $("#productDetail").innerHTML=`<div class="detail"><img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}">
  <div class="detail-copy"><p class="eyebrow">${escapeHtml(p.brand||"DIECAST")}${p.scale?` • ${escapeHtml(p.scale)}`:""}</p>
  <h2>${escapeHtml(p.name)}</h2><div class="price">${money(p.price)}</div><p>${escapeHtml(p.description||"")}</p>
  <p class="muted">${Number(p.stock)>0?`In Stock • ${p.stock} available`:"Out Of Stock"}</p>
  <button class="button primary full" ${Number(p.stock)<=0?"disabled":""} onclick="addToCart('${p.id}');document.getElementById('productDialog').close()">Add to cart</button></div></div>`;
  $("#productDialog").showModal();
}
function checkout(){
  if(!cart.length)return;
  if(!config.whatsappNumber || !config.upiId){alert("The owner has not configured WhatsApp and UPI details yet.");return;}
  $("#upiId").textContent=config.upiId;
  $("#checkoutDialog").showModal();
}
function submitOrder(e){
  e.preventDefault();
  if(!config.whatsappNumber)return;
  const data=new FormData(e.target),items=cart.map(x=>({...x,p:getProduct(x.id)})).filter(x=>x.p);
  const total=items.reduce((a,x)=>a+x.p.price*x.qty,0);
  let msg=`Hello Scale Street! 👋%0A%0AI would like to place an order.%0A%0AORDER%0A━━━━━━━━━━━━━━%0A`;
  items.forEach((x,i)=>msg+=`${i+1}. ${x.p.name}%0A   Qty: ${x.qty}%0A   ${money(x.p.price*x.qty)}%0A`);
  msg+=`━━━━━━━━━━━━━━%0ATOTAL: ${money(total)}%0A%0ACUSTOMER%0AName: ${data.get("name")}%0AWhatsApp: ${data.get("phone")}%0AAddress: ${data.get("address")}%0APayment: UPI%0AUPI ID: ${config.upiId}%0A%0APlease confirm my order.`;
  window.open(`https://wa.me/${config.whatsappNumber}?text=${msg}`,"_blank","noopener");
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function escapeAttr(v){return escapeHtml(v);}

document.addEventListener("DOMContentLoaded",()=>{
  renderCategories();renderProducts();renderCart();
  $("#search")?.addEventListener("input",renderProducts);$("#categoryFilter")?.addEventListener("change",renderProducts);
  $("#cartButton")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);$("#backdrop")?.addEventListener("click",closeCart);
  $("#checkoutButton")?.addEventListener("click",checkout);$("#checkoutForm")?.addEventListener("submit",submitOrder);
  window.addEventListener("scroll",()=>$("#nav").classList.toggle("scrolled",scrollY>20));
  const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));
});