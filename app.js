/* =========================================================
   ADMIN CONFIGURATION
   Ganti SATU KALI saja URL di bawah dengan URL model AI kamu.
   Pengguna website tidak perlu memasukkan URL ini.
   ========================================================= */
const MODEL_URL = "PASTE_MODEL_URL_HERE/";

let model=null, stream=null, total=0, recyclable=0, eco=0;

const classMap={
  plastic:{key:"plastic",name:"Plastik",rec:true,tip:"Pisahkan botol atau kemasan plastik. Kosongkan dan, bila memungkinkan, bersihkan sebelum didaur ulang."},
  paper:{key:"paper",name:"Kertas",rec:true,tip:"Pisahkan kertas atau kardus yang bersih dan kering untuk didaur ulang."},
  organic:{key:"organic",name:"Organik",rec:true,tip:"Sampah organik seperti sisa makanan dan daun dapat dipisahkan untuk pengomposan."},
  residue:{key:"residue",name:"Residu",rec:false,tip:"Masukkan sampah yang tidak dapat didaur ulang ke tempat sampah residu."}
};

async function loadModelAutomatically(){
  const status=document.getElementById("modelStatus");
  const ai=document.getElementById("aiStatus");
  if(MODEL_URL.includes("PASTE_MODEL_URL_HERE")){
    ai.textContent="OFFLINE";
    ai.style.color="#a12626";
    status.textContent="Model belum dikonfigurasi admin. Website siap, tetapi AI belum dapat melakukan prediksi.";
    return;
  }
  try{
    status.textContent="Memuat model AI secara otomatis...";
    model=await tmImage.load(MODEL_URL+"model.json",MODEL_URL+"metadata.json");
    ai.textContent="ONLINE";
    ai.style.color="#087a43";
    status.textContent="Model AI berhasil dimuat. Pengguna siap melakukan scan.";
    document.getElementById("status").textContent="AI READY";
  }catch(err){
    console.error(err);
    ai.textContent="ERROR"; ai.style.color="#a12626";
    status.textContent="Model gagal dimuat. Admin perlu memeriksa URL model.";
  }
}

window.addEventListener("load",loadModelAutomatically);

document.getElementById("start").onclick=async()=>{
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    const v=document.getElementById("video");
    v.srcObject=stream;v.style.display="block";
    document.getElementById("placeholder").style.display="none";
    document.getElementById("status").textContent="CAMERA ON";
  }catch(e){alert("Kamera tidak dapat diakses. Berikan izin kamera dan gunakan HTTPS atau localhost.");}
};

document.getElementById("stop").onclick=()=>{
  if(stream)stream.getTracks().forEach(t=>t.stop());
  document.getElementById("video").style.display="none";
  document.getElementById("placeholder").style.display="block";
  document.getElementById("scanline").style.display="none";
  document.getElementById("status").textContent="READY";
};

document.getElementById("scan").onclick=async()=>{
  if(!stream){alert("Mulai kamera terlebih dahulu.");return;}
  if(!model){alert("AI belum siap. Tunggu sampai status AI ONLINE.");return;}
  const line=document.getElementById("scanline");
  line.style.display="block";document.getElementById("status").textContent="AI SCANNING...";
  try{
    const predictions=await model.predict(document.getElementById("video"));
    predictions.sort((a,b)=>b.probability-a.probability);
    const top=predictions[0];
    const cls=normalize(top.className);
    if(!cls){showUnknown(top.className,top.probability);}
    else showResult(classMap[cls],top.probability,top.className);
  }catch(e){console.error(e);alert("Prediksi AI gagal. Coba lagi.");}
  line.style.display="none";
};

function normalize(name){
  const n=name.toLowerCase().trim();
  if(n.includes("plast"))return"plastic";
  if(n.includes("kertas")||n.includes("paper")||n.includes("cardboard")||n.includes("kardus"))return"paper";
  if(n.includes("organik")||n.includes("organic")||n.includes("food")||n.includes("daun"))return"organic";
  if(n.includes("residu")||n.includes("residue")||n.includes("lain")||n.includes("other"))return"residue";
  return null;
}
function showUnknown(label,prob){
  const pct=(prob*100).toFixed(1);
  document.getElementById("status").textContent="UNKNOWN";
  document.getElementById("result").textContent=label;
  document.getElementById("confidence").textContent=pct+"%";
  document.getElementById("fill").style.width=pct+"%";
  document.getElementById("tip").innerHTML="⚠️ Kelas model belum dikenali. Gunakan empat kelas: Organik, Plastik, Kertas, Residu.";
}
function showResult(item,prob,raw){
  total++;if(item.rec)recyclable++;eco+=item.rec?20:5;
  const pct=(prob*100).toFixed(1);
  document.getElementById("result").textContent=item.name;
  document.getElementById("confidence").textContent=pct+"%";
  document.getElementById("fill").style.width=pct+"%";
  document.getElementById("status").textContent="DETECTED";
  document.getElementById("tip").innerHTML="💡 "+item.tip;
  ["organic","plastic","paper","residue"].forEach(k=>document.getElementById(k).classList.remove("active"));
  document.getElementById(item.key).classList.add("active");
  document.getElementById("total").textContent=total;
  document.getElementById("recyclable").textContent=recyclable;
  document.getElementById("eco").textContent=eco+" XP";
  document.getElementById("accuracy").textContent=pct+"%";
  const h=document.getElementById("history");
  if(total===1)h.innerHTML="";
  const time=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
  const row=document.createElement("div");row.className="row";
  row.innerHTML="<span>🔍 "+time+" — "+item.name+"</span><b>"+pct+"%</b>";
  h.prepend(row);
}
