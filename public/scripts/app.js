
var ordine = new Array()
var listaArticoli = new Array()
var totaleOrdine = 0
var nome = ""

var dataOrdine      // Data YYYYMMDD
var orarioOrdine    // Orario XX:YY
var fasciaOrdine    // 1..14
var pizzeOrdinate   // Array per ogni fascia con il totale pizze già ordinate

/*
    Mosta la pagina principale
*/
function showHome(item)
{
    console.log('showHome '+item)
    document.getElementById('pageContatti').style.display='none';
    document.getElementById('pageOrdine').style.display='none';
    document.getElementById('pageHome').style.display='block';
    getMenuItems(item)
}


/**
 * Mostra la pagina con i contatti
 */
function showContatti()
{
    console.log('showContatti')
    document.getElementById('pageContatti').style.display='block';
    document.getElementById('pageHome').style.display='none';
    document.getElementById('pageOrdine').style.display='none';
}


function showOrdine()
{
    console.log('showOrdine')
    if (ordine.length==0){
        M.toast({html: "Nessun elemento in ordine"})
        return
    }
    // Svuota eventuale lista precedente
    document.querySelectorAll('.addedOrder').forEach( e => e.remove())
    // Riempie la pagina Ordine
    var template = document.querySelector('#templateOrdine');
    var list = document.querySelector('#mainListOrdine');
    var totaleDiv = document.querySelector('#totaleOrdine');

    totaleOrdine = 0;
    ordine.forEach( function( val, idx){
        var newSub = document.querySelector('#templateOrdine').cloneNode(true);
        newSub.style.display='block'
        newSub.classList.add('addedOrder')
        newSub.querySelector('#templateOrdineTitle').textContent = val.nome
        newSub.querySelector('#templateOrdineNo').textContent = val.qty
        document.querySelector('#mainListOrdine').appendChild(newSub)
        totaleOrdine += Number(val.qty)*Number(val.prezzo)
    })
    totaleDiv.innerHTML = "Totale ordine: <b>&euro; "+totaleOrdine.toFixed(2)+"</b>"

    // Mostra pagina
    document.getElementById('pageOrdine').style.display='block';
    document.getElementById('pageHome').style.display='none';
}


function giornoScelto(ev){
    dataOrdine = ev.target.getAttribute('data')
    console.log("> GiornoScelto ", dataOrdine)

    showFascia()
}


function showGiorni(){

    // Controllo nome inserito dall'utente
    var nome = document.querySelector("#orderName").value;
    if(nome==""){
        M.toast({html:"Il nome è obbligatorio"});
        return;
    }
    
    // Crea llista dei giorni con i nomi appropriati
    var gg = [ "DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"]
    var container = document.querySelector('#listaGiorni')
    var now = new Date()
    var i = 0;
    while(i < 7){
        var el = document.createElement("li")
        el.classList.add('collection-item')
        el.classList.add('giorno-item')
        el.style.padding = "25px 5px"
        el.append(gg[now.getDay()] +" "+now.toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric'}))

        // Disabilita il martedì
        if (now.getDay()==2){
            el.classList.add('giornoNonValido')
        }
        else {
            el.classList.add('giornoValido')
            el.setAttribute('data', 
                now.getFullYear().toString() +
                ("0"+(1+now.getMonth()).toString()).slice(-2) + 
                (("0"+now.getDate().toString()).slice(-2))
            )
            var fn = (event) => giornoScelto( event, i)
            el.addEventListener("click", fn)
        }
        container.append(el)

        ++i
        now.setDate( now.getDate()+1)
    }

    // Cambio pagina
    document.getElementById('pageOrdine').style.display='none';
    document.getElementById('pageGiorno').style.display='block';
}


function fasciaScelta(ev){
    orarioOrdine = ev.target.getAttribute('data')
    fasciaOrdine = ev.target.getAttribute('fascia')
    console.log("> Fascia: "+fascia+" - "+orarioOrdine)
}


// Legge da DB la situazione pizze ordinate e aggiorna l'array pizzeOrdinte
async function contaPizzeOrdinate(){
    pizzeOrdinate = new Array()

    // Lista ordini
    var resRef = firebase.firestore().collection("ordini");
    // resRef.get().then( (orderList) => {
    var orderList = await resRef.get()

        // console.log("orderList: ", orderList)
        orderList.forEach(
            function(order){
                var orderData = order.data()
                console.log(orderData)

                console.log(orderData.consegnaData)
                console.log(orderData.consegnaOra)
                console.log(orderData.consegnaFascia)

                pizzeOrdinate[1] = 5
            }
        )
}


// Mostra la fascia oraria con l'indicazione delle pizze già ordinate
async function showFascia(){
    var container = document.querySelector('#gridFascia')
    var i = 0;
    var h = new Date()
    // Orario iniziale
    h.setHours(18)
    h.setMinutes(30)

    console.log("QQQ")
    await contaPizzeOrdinate()
    console.log("WWW")

    while(i < 14){  // Per ogni fascia oraria

        var hh = h.getHours() + ":" + (("0"+h.getMinutes()).slice(-2))

        var el = document.createElement("div")
        el.classList.add('collection-item')
        el.classList.add('fascia-item')
        el.append(hh)
        if (typeof (pizzeOrdinate[i]) !== 'undefined')
            el.append(pizzeOrdinate[i])
            
        if (1){
            el.classList.add('fasciaValida')
            el.setAttribute('data', hh)
            el.setAttribute('fascia', i)
            el.addEventListener("click", fasciaScelta)
        }
        container.append(el)

        ++i
        h.setMinutes( h.getMinutes()+15)
    }
    console.log("EEE")

    // Cambio pagina
    document.getElementById('pageGiorno').style.display='none';
    document.getElementById('pageFasciaOraria').style.display='block';
}

// Mostra la dlg con la richiesta della quantità
function showDlgAddToOrder(e){

    console.log("[showDlgAddToOrder]")
    if (dlgAddToOrder==null){
        console.error("dlgAddToOrder non definito!")
        return
    }
    var p = e.srcElement.parentElement
    while(p.tagName!='LI'){
        p = p.parentElement
    }
    var idx = p.getAttribute('idx')
    var data = listaArticoli[idx]
    // Aggiorna i dati in dlg
    document.querySelector('#dlgAddIdx').val = idx
    document.querySelector('#dlgAddNumero').textContent = "1"
    document.querySelector('#dlgAddNome').textContent = data.nome
    // Apre la dlg
    var dlg = dlgAddToOrder[0]
    dlg.open()
}

function aggiungi1(){
    var el = document.querySelector('#dlgAddNumero')
    var no = Number(el.textContent)
    no += 1
    el.textContent = no
}

function togli1(){
    var el = document.querySelector('#dlgAddNumero')
    var no = el.textContent
    if (no>1){
        no -= 1
        el.textContent = no
    }
}

function addToOrder(e){
    console.log("[addToOrder]")

    var idx = document.querySelector('#dlgAddIdx').val
    var articolo = listaArticoli[idx]
    articolo['qty'] = document.querySelector('#dlgAddNumero').textContent

    ordine.push(articolo)
    // updateBadge(ordine.length)
    updateBadge(ordine.length)

    M.toast({ html:"Aggiunto all'ordine!"})
}



function updateBadge(n){
    var n = 0
    ordine.forEach( (value) => {
        n += Number(value.qty)
    })
    var el = document.querySelector('#badge')
    if (n < 1)
        el.textContent = 'Vuoto'
    else
        el.textContent = "Ordine "+n
}



function sendEmail(){
    console.log('[sendEmail]')
    emailSubject = "Ordine Nuova Aurora"
    emailBody = "Ordine:\n1 cipolle + origano\n1 vetegale\n\nGrazie\n\n"
    window.location.href = "mailto:stefano.mora@libero.it?subject=" + emailSubject + "&body=" + emailBody
}

function sendWA(){
    console.log('[sendWA]')
    var wa = "393471418401"
    var text = JSON.stringify(ordine); // "Prova invio messaggio da PWA"
    // window.open("https://api.whatsapp.com/send?phone="+wa+"&text="+text)
    window.location.href("https://api.whatsapp.com/send?phone="+wa+"&text="+text)

    M.toast({html: "Ordine inviato correttamente via WA"})
    ResetOrder()
}


function saveOrder(){
    console.log('[saveOrder]', ordine)

    // Controllo nome
    var nome = document.querySelector("#orderName").value;
    if(nome==""){
        M.toast({html:"Il nome è obbligatorio"});
        return;
    }
    ordine['nome']=nome

    var dbOrdini = firebase.firestore().collection("ordini")
    var id = Date.now().toString(); // dbOrdini.createId();

    // Scrittura record
    dbOrdini.doc(id).set({
        ordine: JSON.stringify(ordine), // "Ordine",
        nome: nome,
		data: firebase.firestore.FieldValue.serverTimestamp(),
        servito: false,
        totale: totaleOrdine,
        consegnaData: dataOrdine,
        consegnaOra: orarioOrdine,
        consegnaFascia: fasciaOrdine
      })
      .then(
         function(){
            console.log("[saveOrder] OK")
            M.toast({html: "Ordine inviato correttamente"})
            setTimeout( function(){ResetOrder(); showHome('pizze')}, 4000);
         }
      )
      .catch(
        function(error){
            console.error("[saveOrder] ", error)
        }
    );
  console.log('[saveOrder]')
}


function ResetOrder() {
    // Reset lista
    ordine = new Array()
    updateBadge(0)
}

async function getData()  {
    console.log("getData")
    try {
        var restaurant = {};

        // Get Restaurant Data
        var resRef = firebase.firestore().collection("menu");
        var resSnap = await resRef.get();
        // console.log(resSnap)
        resSnap.forEach((doc) => {
            console.log(doc.data())
        })
        getMenuItems("pizze")
        return restaurant
    } catch (e) {
        console.error(e)
        return {
            errorMsg: "Something went wrong. Please Try Again."
        }
    }
}


function waitData(submenu, item) {
    return firebase.firestore().collection("menu").doc(submenu).collection(item).get()
}

function InsertItem(datalist, item, tipo){
    // Titolo pagina
    console.log(item)
    if (item){
        var newSub = document.querySelector('#templateMenu').cloneNode(true);
        newSub.classList.add('itemAdded')
        newSub.querySelector('#submenuTitle').textContent = item
        newSub.style.display='block'
        document.querySelector('#mainList').appendChild(newSub);
    }

    datalist.forEach( dataraw => {
        var data = dataraw.data()
        // In Memoria
        var idx = listaArticoli.push(data) -1
        // A video
        var newEl = document.querySelector('#template').cloneNode(true);
        newEl.classList.add('itemAdded')
        newEl.setAttribute('idx', idx.toString())
        newEl.setAttribute('tipo', tipo)
        newEl.onclick = showDlgAddToOrder
        newEl.querySelector('#templateTitle').textContent = data.nome
        newEl.querySelector('#templateDesc').textContent = data.ingredienti
        newEl.querySelector('#templatePrice').innerHTML = "&euro; "+data.prezzo.toFixed(2)
        newEl.style.display='block'
        document.querySelector('#mainList').appendChild(newEl);
    })
}


function getMenuItems(item) {
    console.log("[getMenuItems] "+item)
    // Elimina elementi aggiunti precedentemente
    document.querySelectorAll('.itemAdded').forEach( e => e.remove())

    try {
        var items = {};

        // Get Data
        var resRef = firebase.firestore().collection("menu");
        resRef.doc(item).get().then( async(itemSnap) => {
            console.log(itemSnap.id, itemSnap.data())    // Nome sottomenu - es 'Pizze'
            if (itemSnap.data()==undefined){
                document.querySelector('#menuTitle').textContent = "Nessun dato"
                return
            }
            // Compone il titolo
            document.querySelector('#menuIcon').textContent = itemSnap.data().icona
            document.querySelector('#menuTitle').textContent = itemSnap.data().nome
            
            // Lista articoli
            listaArticoli = new Array()

            // Qeusti hanno un sottomenu
            if (item=='ristorante'){
                var r = await waitData("ristorante",'Antipasti');
                InsertItem( r, "Antipasti")

                r = await waitData("ristorante",'Primi piatti');
                InsertItem( r, 'Primi piatti')

                r = await waitData("ristorante",'Secondi');
                InsertItem( r, "Secondi piatti")

                r = await waitData("ristorante",'Contorni');
                InsertItem( r, "Contorni")

                r = await waitData("ristorante",'Dolci');
                InsertItem( r, "Dessert")
            }
            else if (item=='calzoni'){
                var r = await waitData('calzoni','calzoni');
                InsertItem( r, 'Calzoni', 'pizze')

                r = await waitData('calzoni','pizze alte');
                InsertItem( r, "Pizze alte", 'pizze')

            }
            else if (item=='bevande'){
                var r = await waitData('bevande','Bevande');
                InsertItem( r, 'Bevande')
                var r = await waitData('bevande','Dopo cena');
                InsertItem( r, 'Dopo cena')
                var r = await waitData('bevande','Lista dei vini');
                InsertItem( r, 'Lista dei vini')
            }
            else {
                // SubCollection 'stesso nome'
                resRef.doc(item).collection(item).get().then( (subitemSnap) => {
                    var idx = 0
                    subitemSnap.forEach( (subitem) => {
                        // console.log(subitem.data()) // Elemento
                        var data = subitem.data()
                        listaArticoli.push(data)

                        // Duplica l'elemento 'template'
                        var newEl = document.querySelector('#template').cloneNode(true);
                        newEl.classList.add('itemAdded')
                        newEl.setAttribute('idx', idx.toString())
                        newEl.setAttribute('tipo', item)
                        newEl.onclick = showDlgAddToOrder
                        newEl.querySelector('#templateTitle').textContent = data.nome
                        newEl.querySelector('#templateDesc').textContent = data.ingredienti
                        newEl.querySelector('#templatePrice').innerHTML = "&euro; "+data.prezzo.toFixed(2)
                        newEl.style.display='block'
                        document.querySelector('#mainList').appendChild(newEl);
                        ++idx;
                    })

                    // console.log(listaArticoli)
                })
            }
        })
    } catch (e) {
        return {
            errorMsg: "Something went wrong. Please Try Again."
        }
    }

}


function init() {
    console.log('+init')
    getMenuItems("pizze")
    console.log('-init')
}

// Inizializzazione indipendente dallo stato del serviceWorker
init();
