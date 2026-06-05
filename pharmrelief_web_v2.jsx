import { useState, useMemo, useCallback } from "react";

// ── OCP Data ─────────────────────────────────────────────────────────────────
const COLORS=['#E1F5EE','#E6F1FB','#FBEAF0','#EEEDFE','#FAEEDA','#EAF3DE','#FAECE7'];
const TCOLS=['#085041','#0C447C','#72243E','#3C3489','#633806','#27500A','#712B13'];
const SPECS=[['Dispensary','Retail'],['Compounding','IV Prep'],['Hospital','Clinical'],['LTC','Palliative'],['MTM','Diabetes Mgmt'],['Oncology','Sterile'],['Pediatrics','OB/GYN']];
const STYPES=['Dispensary','Compounding','Hospital','Clinic','LTC','Evening','Overnight'];
const RATES=[85,64,81,78,92,69,74,88,71,83,67,79,86,62,90,73,77,84,68,80,76,87,65,82,70,89,66,75,91,72];
const YRS=[8,2,7,12,5,14,3,9,6,11,4,16,1,10,13,7,2,8,15,5,3,11,6,9,4,12,7,3,10,14];
const SHIFTS_C=[5,71,66,43,28,19,61,34,52,7,23,48,12,37,55,8,41,63,16,29,44,11,58,25,39,17,47,33,20,56];
const RATINGS=[4.7,4.3,4.4,4.9,4.8,4.7,5.0,4.6,4.8,4.5,4.9,4.7,4.4,4.8,4.6,4.9,4.7,4.8,4.5,4.9,4.6,4.8,4.7,4.9,4.5,4.8,4.6,4.7,4.9,4.8];
const PENDING_=[111.63,23.84,572.82,348.50,0,215.20,780.40,0,435.10,162.75,0,590.30,88.20,0,724.60,0,301.40,0,456.80,0];
const AVAIL_=[false,true,false,true,true,false,true,false,true,true,false,true,true,false,true,true,false,true,false,true,true,false,true,true,false,true,true,false,true,true,false,true,true,false,true,true,false,true,true,false,true,false,true,true,false,true,true,false];

const RAW_PH=[
{id:"632899",name:"Abhi",initials:"A",type:"Pharmacist",injection:false,ocp:"632899"},
{id:"635784",name:"Divyam",initials:"D",type:"Pharmacist",injection:false,ocp:"635784"},
{id:"625723",name:"Goutham Kumar",initials:"GK",type:"Pharmacist",injection:true,ocp:"625723"},
{id:"626810",name:"Indu",initials:"I",type:"Pharmacist",injection:true,ocp:"626810"},
{id:"625749",name:"Jagath",initials:"J",type:"Pharmacist",injection:true,ocp:"625749"},
{id:"634222",name:"Lu Lu",initials:"LL",type:"Pharmacist",injection:false,ocp:"634222"},
{id:"635414",name:"Manmeer Virk",initials:"MV",type:"Pharmacist",injection:false,ocp:"635414"},
{id:"628963",name:"Nabil",initials:"N",type:"Pharmacist",injection:true,ocp:"628963"},
{id:"631567",name:"Parisa",initials:"P",type:"Pharmacist",injection:true,ocp:"631567"},
{id:"622841",name:"Rasheed Al-Amin",initials:"RA",type:"Pharmacist",injection:false,ocp:"622841"},
{id:"624109",name:"Sumaiya Begum",initials:"SB",type:"Pharmacist",injection:true,ocp:"624109"},
{id:"630271",name:"Tanya Kowalski",initials:"TK",type:"Pharmacist",injection:false,ocp:"630271"},
{id:"627384",name:"Uchenna Obi",initials:"UO",type:"Pharmacist",injection:true,ocp:"627384"},
{id:"623018",name:"Valentina Cruz",initials:"VC",type:"Pharmacist",injection:false,ocp:"623018"},
{id:"629445",name:"Wei Zhang",initials:"WZ",type:"Pharmacist",injection:true,ocp:"629445"},
{id:"631902",name:"Xanthe Papadopoulos",initials:"XP",type:"Pharmacist",injection:false,ocp:"631902"},
{id:"626573",name:"Yusuf Ibrahim",initials:"YI",type:"Pharmacist",injection:true,ocp:"626573"},
{id:"633847",name:"Zoë Tremblay",initials:"ZT",type:"Pharmacist",injection:false,ocp:"633847"},
{id:"624738",name:"Aarav Sharma",initials:"AS",type:"Pharmacist",injection:true,ocp:"624738"},
{id:"628192",name:"Beatrix Novak",initials:"BN",type:"Pharmacist",injection:false,ocp:"628192"},
{id:"622374",name:"Carlos Mendez",initials:"CM",type:"Pharmacist",injection:true,ocp:"622374"},
{id:"634901",name:"Dina Khalil",initials:"DK",type:"Pharmacist",injection:true,ocp:"634901"},
{id:"623657",name:"Elena Voronova",initials:"EV",type:"Pharmacist",injection:false,ocp:"623657"},
{id:"629123",name:"Fatima Al-Hassan",initials:"FA",type:"Pharmacist",injection:true,ocp:"629123"},
{id:"625380",name:"Giorgio Esposito",initials:"GE",type:"Pharmacist",injection:false,ocp:"625380"},
{id:"631740",name:"Harpreet Gill",initials:"HG",type:"Pharmacist",injection:true,ocp:"631740"},
{id:"627965",name:"Isabelle Fontaine",initials:"IF",type:"Pharmacist",injection:false,ocp:"627965"},
{id:"624512",name:"Jae-Won Park",initials:"JP",type:"Pharmacist",injection:true,ocp:"624512"},
{id:"630837",name:"Kavya Nair",initials:"KN",type:"Pharmacist",injection:false,ocp:"630837"},
{id:"623291",name:"Liam O'Brien",initials:"LO",type:"Pharmacist",injection:true,ocp:"623291"},
{id:"628749",name:"Mei-Ling Chen",initials:"MC",type:"Pharmacist",injection:false,ocp:"628749"},
{id:"625967",name:"Nina Petrov",initials:"NP",type:"Pharmacist",injection:true,ocp:"625967"},
{id:"632184",name:"Omar Farouk",initials:"OF",type:"Pharmacist",injection:false,ocp:"632184"},
{id:"624073",name:"Priya Arora",initials:"PA",type:"Pharmacist",injection:true,ocp:"624073"},
{id:"629618",name:"Quynh Nguyen",initials:"QN",type:"Pharmacist",injection:false,ocp:"629618"},
{id:"622956",name:"Ravi Patel",initials:"RP",type:"Pharmacist",injection:true,ocp:"622956"},
{id:"631425",name:"Sara Johansson",initials:"SJ",type:"Pharmacist",injection:false,ocp:"631425"},
{id:"627301",name:"Tamar Cohen",initials:"TC",type:"Pharmacist",injection:true,ocp:"627301"},
{id:"634667",name:"Uma Krishnamurthy",initials:"UK",type:"Pharmacist",injection:false,ocp:"634667"},
{id:"623834",name:"Victor Leblanc",initials:"VL",type:"Pharmacist",injection:true,ocp:"623834"},
{id:"630092",name:"Adabpreet Kaur",initials:"AK",type:"Pharmacy Technician",injection:false,ocp:"635009"},
{id:"631283",name:"Harnoor",initials:"H",type:"Pharmacy Technician",injection:false,ocp:"635066"},
{id:"632741",name:"Mehtaabveer Singh",initials:"MS",type:"Pharmacy Technician",injection:false,ocp:"634626"},
{id:"629504",name:"Angela Torres",initials:"AT",type:"Pharmacy Technician",injection:false,ocp:"629504"},
{id:"627819",name:"Ben Liu",initials:"BL",type:"Pharmacy Technician",injection:false,ocp:"627819"},
{id:"633062",name:"Chioma Eze",initials:"CE",type:"Pharmacy Technician",injection:false,ocp:"633062"},
{id:"625194",name:"Deepika Reddy",initials:"DR",type:"Pharmacy Technician",injection:false,ocp:"625194"},
{id:"631748",name:"Edward Kim",initials:"EK",type:"Pharmacy Technician",injection:false,ocp:"631748"},
];

const RAW_LOC=[
{id:"311393",name:"H&H Ontario Pharmacy",initials:"HH",address:"43-1111 Finch Ave W",city:"North York",zip:"M3J 2E5",phone:"+1(866)779-9666"},
{id:"311210",name:"K-Town Pharmacy",initials:"KT",address:"6-300 Steeles Ave W",city:"Vaughan",zip:"L4J 1A1",phone:"+1(905)764-0909"},
{id:"305937",name:"1355 Bank St. Pharmacy",initials:"BS",address:"109-1355 Bank St",city:"Ottawa",zip:"K1H 8K7",phone:"+1(613)731-2200"},
{id:"25122",name:"16th Avenue Drug Mart",initials:"AD",address:"8-1 Mintleaf Gate",city:"Markham",zip:"L3P 5X4",phone:"+1(905)471-6010"},
{id:"306482",name:"1ClinicRx Pharmacy",initials:"CR",address:"16 Yonge St",city:"Toronto",zip:"M5E 2A1",phone:"+1(647)344-8800"},
{id:"305964",name:"1st Place Pharmacy",initials:"1P",address:"D-300 Fourth Ave",city:"St. Catharines",zip:"L2S 0E6",phone:"+1(365)653-8126"},
{id:"303094",name:"360 Pharmacy",initials:"3X",address:"360 Highway 7 E",city:"Richmond Hill",zip:"L4B 3Y7",phone:"+1(905)889-1360"},
{id:"307640",name:"3M Drug Mart",initials:"3M",address:"7117 Bathurst St Unit 105",city:"Thornhill",zip:"L4J 2J6",phone:"+1(905)882-4774"},
{id:"303943",name:"3M Lawrence Pharmacy",initials:"3L",address:"3077 Bathurst St",city:"North York",zip:"M6A 1Z9",phone:"+1(416)782-3333"},
{id:"310883",name:"401 & 404 Medical Pharmacy",initials:"4M",address:"332 Consumers Rd",city:"North York",zip:"M2J 1P8",phone:"+1(416)652-4303"},
{id:"308741",name:"Abbotsford Pharmacy",initials:"AB",address:"120 Huron St",city:"Woodstock",zip:"N4S 6H2",phone:"+1(519)537-2273"},
{id:"309124",name:"Acacia Pharmacy",initials:"AC",address:"200 James St S",city:"Hamilton",zip:"L8P 3A9",phone:"+1(905)522-1234"},
{id:"307856",name:"Acclaim Pharmacy",initials:"AP",address:"460 Hespeler Rd Unit 15",city:"Cambridge",zip:"N1R 6J8",phone:"+1(519)624-7890"},
{id:"311047",name:"Ace Drug Mart",initials:"AC",address:"1375 Richmond St",city:"London",zip:"N6G 2M2",phone:"+1(519)672-5432"},
{id:"306730",name:"Action Pharmacy",initials:"AP",address:"850 Upper James St",city:"Hamilton",zip:"L9C 3A4",phone:"+1(905)388-6741"},
{id:"304512",name:"Advance Pharmacy",initials:"AD",address:"2065 Finch Ave W Unit 13",city:"North York",zip:"M3N 2V7",phone:"+1(416)749-3300"},
{id:"310238",name:"Agincourt Pharmacy",initials:"AG",address:"4750 Sheppard Ave E",city:"Scarborough",zip:"M1S 3V6",phone:"+1(416)291-8765"},
{id:"308934",name:"Ajax Compounding Rx",initials:"AJ",address:"231 Harwood Ave S",city:"Ajax",zip:"L1S 2J1",phone:"+1(905)426-1992"},
{id:"305671",name:"Albion Pharmacy",initials:"AL",address:"1530 Albion Rd",city:"Etobicoke",zip:"M9V 1B4",phone:"+1(416)741-5123"},
{id:"309847",name:"Aldershot Pharmacy",initials:"AS",address:"495 Plains Rd E",city:"Burlington",zip:"L7T 2E3",phone:"+1(905)632-8800"},
];

const OPEN_=[2,0,1,3,0,4,1,0,2,3,0,1,4,2,0,3,1,0,2,4];
const PHARMACISTS=RAW_PH.map((r,i)=>({...r,color:COLORS[i%7],textColor:TCOLS[i%7],specialties:SPECS[i%7],rating:RATINGS[i%RATINGS.length],shifts:SHIFTS_C[i%SHIFTS_C.length],rate:RATES[i%RATES.length],available:AVAIL_[i%AVAIL_.length],yrs:YRS[i%YRS.length],payroll_pending:PENDING_[i%PENDING_.length],verified:true}));
const LOCATIONS=RAW_LOC.map((r,i)=>({...r,color:COLORS[i%7],textColor:TCOLS[i%7],shift_type:STYPES[i%7],rate:RATES[i%RATES.length],open_shifts:OPEN_[i%OPEN_.length],verified:true}));

// ── Seed bookings on calendar ─────────────────────────────────────────────────
const SEED_BOOKINGS=[
  {id:"BK001",pharmacistId:"632899",locationId:"309124",date:"2026-06-05",start:"09:00",end:"17:00",type:"Dispensary",rate:85,status:"Confirmed",notes:"Kroll software required"},
  {id:"BK002",pharmacistId:"625723",locationId:"306730",date:"2026-06-06",start:"14:00",end:"22:00",type:"Compounding",rate:81,status:"Confirmed",notes:""},
  {id:"BK003",pharmacistId:"624073",locationId:"309847",date:"2026-06-07",start:"08:00",end:"16:00",type:"Dispensary",rate:78,status:"Pending",notes:"Bilingual preferred"},
  {id:"BK004",pharmacistId:"626810",locationId:"311393",date:"2026-06-09",start:"09:00",end:"17:00",type:"Hospital",rate:92,status:"Confirmed",notes:""},
  {id:"BK005",pharmacistId:"628963",locationId:"311210",date:"2026-06-10",start:"07:00",end:"19:00",type:"LTC",rate:88,status:"Confirmed",notes:"12-hr shift"},
  {id:"BK006",pharmacistId:"625749",locationId:"305937",date:"2026-06-12",start:"09:00",end:"17:00",type:"Clinic",rate:69,status:"Pending",notes:""},
  {id:"BK007",pharmacistId:"622841",locationId:"310883",date:"2026-06-14",start:"08:00",end:"16:00",type:"Dispensary",rate:62,status:"Confirmed",notes:""},
  {id:"BK008",pharmacistId:"631425",locationId:"309124",date:"2026-06-16",start:"09:00",end:"17:00",type:"Dispensary",rate:90,status:"Confirmed",notes:""},
  {id:"BK009",pharmacistId:"627384",locationId:"307640",date:"2026-06-18",start:"15:00",end:"23:00",type:"Evening",rate:74,status:"Pending",notes:"Evening premium"},
  {id:"BK010",pharmacistId:"634901",locationId:"308934",date:"2026-06-21",start:"09:00",end:"17:00",type:"Compounding",rate:88,status:"Confirmed",notes:""},
  {id:"BK011",pharmacistId:"629445",locationId:"311047",date:"2026-06-23",start:"07:00",end:"15:00",type:"Hospital",rate:85,status:"Confirmed",notes:""},
  {id:"BK012",pharmacistId:"630271",locationId:"304512",date:"2026-06-25",start:"09:00",end:"17:00",type:"Retail",rate:67,status:"Confirmed",notes:""},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const I=({n,sz,col,style})=><i className={`ti ti-${n}`} style={{fontSize:sz||15,color:col||'inherit',...style}} aria-hidden="true"/>;
const fmt=(v,dec=0)=>typeof v==='number'?v.toLocaleString('en-CA',{minimumFractionDigits:dec,maximumFractionDigits:dec}):v;
const S={
  wrap:{fontFamily:"'DM Sans',sans-serif",background:'var(--color-background-tertiary)',minHeight:'100vh'},
  bar:{background:'#04342C',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100},
  logo:{color:'#E1F5EE',fontSize:17,fontWeight:600,display:'flex',alignItems:'center',gap:8,letterSpacing:'-.3px'},
  nav:{background:'var(--color-background-primary)',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',alignItems:'center',gap:2,padding:'6px 12px',overflowX:'auto',position:'sticky',top:44,zIndex:99},
  nb:(a)=>({fontSize:12,padding:'6px 12px',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap',border:'none',fontFamily:'inherit',background:a?'#E1F5EE':'transparent',color:a?'#0F6E56':'var(--color-text-secondary)',fontWeight:a?500:400}),
  content:{padding:'18px 16px',maxWidth:960,margin:'0 auto'},
  card:{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:12,padding:16},
  metric:{background:'var(--color-background-secondary)',borderRadius:8,padding:'11px 14px'},
  pill:(bg,col)=>({fontSize:10,padding:'2px 8px',borderRadius:20,background:bg,color:col,fontWeight:500,whiteSpace:'nowrap',display:'inline-block'}),
  btn:(bg,col,bc)=>({fontSize:12,padding:'6px 14px',borderRadius:8,cursor:'pointer',fontFamily:'inherit',background:bg||'transparent',color:col||'var(--color-text-secondary)',border:`0.5px solid ${bc||'var(--color-border-secondary)'}`,fontWeight:500}),
  btnP:{fontSize:13,padding:'8px 18px',borderRadius:8,cursor:'pointer',fontFamily:'inherit',background:'#1D9E75',color:'#fff',border:'none',fontWeight:500},
  inp:{fontFamily:'inherit',fontSize:12,color:'var(--color-text-primary)',padding:'7px 11px',border:'0.5px solid var(--color-border-tertiary)',borderRadius:8,background:'var(--color-background-secondary)',width:'100%'},
  av:(bg,col,r)=>({width:r||36,height:r||36,borderRadius:'50%',background:bg,color:col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:r?r*.3:11,fontWeight:600,flexShrink:0}),
  tag:{fontSize:10,padding:'2px 7px',borderRadius:20,background:'var(--color-background-secondary)',color:'var(--color-text-secondary)',border:'0.5px solid var(--color-border-tertiary)'},
  vb:{fontSize:10,padding:'2px 7px',borderRadius:20,background:'#E1F5EE',color:'#085041',fontWeight:500,display:'inline-flex',alignItems:'center',gap:3},
};

function Pill({status}){const m={Confirmed:['#E1F5EE','#085041'],Active:['#E1F5EE','#085041'],Paid:['#E1F5EE','#085041'],Pending:['#FAEEDA','#633806'],Processing:['#E6F1FB','#0C447C'],Cancelled:['#FCEBEB','#791F1F'],Available:['#E1F5EE','#085041']};const[bg,col]=m[status]||['#F1EFE8','#444441'];return<span style={S.pill(bg,col)}>{status}</span>;}

function Avatar({p,r}){return<div style={{...S.av(p.color,p.textColor,r)}}>{p.initials}</div>;}

function LocAvatar({l,r}){return<div style={{...S.av(l.color,l.textColor,r),borderRadius:8}}>{l.initials}</div>;}

function SearchBar({value,onChange,placeholder}){return<div style={{display:'flex',alignItems:'center',gap:7,background:'var(--color-background-secondary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:8,padding:'6px 10px',flex:1,maxWidth:300}}><I n="search" sz={13} col="var(--color-text-secondary)"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||'Search…'} style={{border:'none',background:'transparent',fontFamily:'inherit',fontSize:12,color:'var(--color-text-primary)',outline:'none',width:'100%'}}/></div>;}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({bookings,onNav}){
  const thisMonth=bookings.filter(b=>b.date.startsWith('2026-06'));
  const confirmed=thisMonth.filter(b=>b.status==='Confirmed');
  const pending=thisMonth.filter(b=>b.status==='Pending');
  const revenue=confirmed.reduce((a,b)=>{const h=parseInt(b.end)-parseInt(b.start);return a+h*b.rate;},0);
  return<div>
    <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,color:'var(--color-text-primary)',marginBottom:3}}>Good morning — PharmRelief Agency</div>
    <p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>Wednesday, June 3, 2026 · OCP registry: 28,909 pharmacists · 5,416 active pharmacies</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
      {[['Shifts this month',thisMonth.length,'Booked','#1D9E75','calendar-check'],['Confirmed',confirmed.length,'Ready to go','#1D9E75','circle-check'],['Pending',pending.length,'Awaiting confirm','#BA7517','clock'],['Est. revenue','$'+fmt(revenue),'June billings','#185FA5','coin']].map(([l,v,s,c,ic])=><div key={l} style={S.metric}><div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:4,display:'flex',alignItems:'center',gap:4}}><I n={ic} sz={12}/>{l}</div><div style={{fontSize:20,fontWeight:600,color:'var(--color-text-primary)'}}>{v}</div><div style={{fontSize:11,marginTop:2,color:c}}>{s}</div></div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
      <div style={S.card}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><I n="calendar-event" col="#1D9E75"/>Upcoming bookings</div>
        {bookings.filter(b=>b.date>='2026-06-03').slice(0,5).map(b=>{const ph=PHARMACISTS.find(p=>p.id===b.pharmacistId);const loc=LOCATIONS.find(l=>l.id===b.locationId);return ph&&loc?<div key={b.id} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <Avatar p={ph} r={32}/>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{ph.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{loc.name.substring(0,22)} · {b.date.slice(5)} · {b.start}–{b.end}</div></div>
          <Pill status={b.status}/>
        </div>:null;})}
      </div>
      <div style={S.card}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><I n="users" col="#1D9E75"/>Available pharmacists</div>
        {PHARMACISTS.filter(p=>p.available).slice(0,5).map(p=><div key={p.id} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <Avatar p={p} r={32}/>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{p.type} · ${p.rate}/hr · {p.specialties[0]}</div></div>
          <button onClick={()=>onNav('booking')} style={{...S.btn('#E1F5EE','#0F6E56','#1D9E75'),fontSize:11,padding:'3px 10px'}}>Book</button>
        </div>)}
      </div>
    </div>
    <div style={S.card}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><I n="chart-bar" col="#1D9E75"/>June 2026 — shift activity by week</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
        {[['Week 1 (Jun 1–7)',bookings.filter(b=>b.date<='2026-06-07').length,'Jun 1–7'],['Week 2 (Jun 8–14)',bookings.filter(b=>b.date>='2026-06-08'&&b.date<='2026-06-14').length,'Jun 8–14'],['Week 3 (Jun 15–21)',bookings.filter(b=>b.date>='2026-06-15'&&b.date<='2026-06-21').length,'Jun 15–21'],['Week 4 (Jun 22–30)',bookings.filter(b=>b.date>='2026-06-22').length,'Jun 22–30']].map(([label,count,range])=><div key={label} style={{...S.metric,textAlign:'center'}}>
          <div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:6}}>{range}</div>
          <div style={{fontSize:26,fontWeight:600,color:'#1D9E75'}}>{count}</div>
          <div style={{height:4,background:'#E1F5EE',borderRadius:2,marginTop:8}}><div style={{height:4,width:`${Math.min(100,(count/4)*100)}%`,background:'#1D9E75',borderRadius:2}}/></div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ── Shift Booking ─────────────────────────────────────────────────────────────
function ShiftBooking({bookings,setBookings}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({pharmacistId:'',locationId:'',date:'',start:'09:00',end:'17:00',type:'Dispensary',rate:'',notes:'',urgency:'Standard'});
  const [search,setSearch]=useState('');
  const [locSearch,setLocSearch]=useState('');
  const [success,setSuccess]=useState(null);

  const ph=form.pharmacistId?PHARMACISTS.find(p=>p.id===form.pharmacistId):null;
  const loc=form.locationId?LOCATIONS.find(l=>l.id===form.locationId):null;
  const filteredPh=useMemo(()=>PHARMACISTS.filter(p=>p.available&&(p.name.toLowerCase().includes(search.toLowerCase())||p.specialties.some(s=>s.toLowerCase().includes(search.toLowerCase())))),[search]);
  const filteredLoc=useMemo(()=>LOCATIONS.filter(l=>l.name.toLowerCase().includes(locSearch.toLowerCase())||l.city.toLowerCase().includes(locSearch.toLowerCase())),[locSearch]);

  const hours=form.start&&form.end?(parseInt(form.end)-parseInt(form.start)):8;
  const rate=parseInt(form.rate)||ph?.rate||0;
  const gross=hours*rate;
  const hst=gross*.13;
  const total=gross+hst;

  function book(){
    const id='BK'+String(bookings.length+100).padStart(3,'0');
    const nb={id,pharmacistId:form.pharmacistId,locationId:form.locationId,date:form.date,start:form.start,end:form.end,type:form.type,rate:rate,status:'Pending',notes:form.notes};
    setBookings([...bookings,nb]);
    setSuccess(nb);
    setStep(1);
    setForm({pharmacistId:'',locationId:'',date:'',start:'09:00',end:'17:00',type:'Dispensary',rate:'',notes:'',urgency:'Standard'});
  }

  if(success) return<div>
    <div style={{...S.card,textAlign:'center',padding:32,marginBottom:14}}>
      <div style={{width:60,height:60,borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><I n="circle-check" sz={28} col="#1D9E75"/></div>
      <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:6}}>Shift booked successfully!</div>
      <div style={{fontSize:13,color:'var(--color-text-secondary)',marginBottom:20}}>Booking ID: {success.id} · Status: Pending confirmation</div>
      <div style={{background:'var(--color-background-secondary)',borderRadius:10,padding:16,textAlign:'left',marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[['Pharmacist',PHARMACISTS.find(p=>p.id===success.pharmacistId)?.name],['Pharmacy',LOCATIONS.find(l=>l.id===success.locationId)?.name],['Date',success.date],['Time',`${success.start}–${success.end}`],['Shift type',success.type],['Rate',`$${success.rate}/hr`]].map(([l,v])=><div key={l}><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{l}</div><div style={{fontSize:13,fontWeight:500,marginTop:2}}>{v}</div></div>)}
        </div>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center'}}>
        <button onClick={()=>setSuccess(null)} style={S.btnP}>Book another shift</button>
        <button onClick={()=>setSuccess(null)} style={S.btn()}>View calendar</button>
      </div>
    </div>
  </div>;

  return<div>
    <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Book a shift</div>
    <p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:16}}>Match an available pharmacist to a pharmacy location · {PHARMACISTS.filter(p=>p.available).length} pharmacists available now</p>

    {/* Progress */}
    <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:20}}>
      {[['1','Select pharmacist'],['2','Select pharmacy'],['3','Shift details'],['4','Confirm']].map(([n,label],i)=><>
        <div key={n} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:step>=i+1?'#1D9E75':'var(--color-background-secondary)',color:step>=i+1?'#fff':'var(--color-text-secondary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600}}>{step>i+1?<I n="check" sz={13} col="#fff"/>:n}</div>
          <div style={{fontSize:10,color:step===i+1?'#0F6E56':'var(--color-text-secondary)',fontWeight:step===i+1?500:400,whiteSpace:'nowrap'}}>{label}</div>
        </div>
        {i<3&&<div key={`line${i}`} style={{flex:1,height:1,background:step>i+1?'#1D9E75':'var(--color-border-tertiary)',marginBottom:14,marginTop:2}}/>}
      </>)}
    </div>

    {/* Step 1 — Pharmacist */}
    {step===1&&<div style={S.card}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Select pharmacist</div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search name or specialty…"/>
      <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,maxHeight:340,overflowY:'auto'}}>
        {filteredPh.map(p=><div key={p.id} onClick={()=>{setForm(f=>({...f,pharmacistId:p.id,rate:p.rate}));setStep(2);}} style={{...S.card,cursor:'pointer',padding:12,border:`0.5px solid ${form.pharmacistId===p.id?'#1D9E75':'var(--color-border-tertiary)'}`,background:form.pharmacistId===p.id?'#E1F5EE':'var(--color-background-primary)'}}>
          <div style={{display:'flex',gap:9,alignItems:'center',marginBottom:8}}>
            <Avatar p={p} r={34}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{p.type}</div></div>
            <div style={{fontSize:13,fontWeight:600,color:'#1D9E75'}}>${p.rate}/hr</div>
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {p.specialties.map(s=><span key={s} style={S.tag}>{s}</span>)}
            {p.injection&&<span style={{...S.tag,background:'#E6F1FB',color:'#0C447C'}}>Injection</span>}
          </div>
          <div style={{marginTop:8,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={S.vb}><I n="shield-check" sz={9}/>OCP #{p.ocp}</span>
            <span style={{fontSize:10,color:'var(--color-text-secondary)'}}>★{p.rating} · {p.shifts} shifts</span>
          </div>
        </div>)}
      </div>
    </div>}

    {/* Step 2 — Pharmacy */}
    {step===2&&<div style={S.card}>
      <button onClick={()=>setStep(1)} style={{...S.btn(),marginBottom:12,display:'flex',alignItems:'center',gap:5,fontSize:11}}><I n="arrow-left" sz={11}/>Back</button>
      <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Select pharmacy</div>
      {ph&&<div style={{background:'#E1F5EE',borderRadius:8,padding:10,marginBottom:12,display:'flex',alignItems:'center',gap:9}}><Avatar p={ph} r={32}/><div><div style={{fontSize:12,fontWeight:500}}>{ph.name}</div><div style={{fontSize:11,color:'#085041'}}>{ph.type} · ${ph.rate}/hr selected</div></div></div>}
      <SearchBar value={locSearch} onChange={setLocSearch} placeholder="Search pharmacy or city…"/>
      <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,maxHeight:320,overflowY:'auto'}}>
        {filteredLoc.map(l=><div key={l.id} onClick={()=>{setForm(f=>({...f,locationId:l.id}));setStep(3);}} style={{...S.card,cursor:'pointer',padding:12,border:`0.5px solid ${form.locationId===l.id?'#1D9E75':'var(--color-border-tertiary)'}`,background:form.locationId===l.id?'#E1F5EE':'var(--color-background-primary)'}}>
          <div style={{display:'flex',gap:9,alignItems:'center',marginBottom:8}}>
            <LocAvatar l={l} r={34}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{l.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{l.city}</div></div>
            {l.open_shifts>0&&<span style={S.pill('#FAEEDA','#633806')}>{l.open_shifts} open</span>}
          </div>
          <div style={{fontSize:11,color:'var(--color-text-secondary)',display:'flex',gap:10}}>
            <span>{l.address}</span><span style={{fontWeight:500,color:'#1D9E75'}}>${l.rate}/hr</span>
          </div>
          <div style={{marginTop:6}}><span style={S.vb}><I n="shield-check" sz={9}/>#{l.id}</span></div>
        </div>)}
      </div>
    </div>}

    {/* Step 3 — Details */}
    {step===3&&<div style={S.card}>
      <button onClick={()=>setStep(2)} style={{...S.btn(),marginBottom:12,display:'flex',alignItems:'center',gap:5,fontSize:11}}><I n="arrow-left" sz={11}/>Back</button>
      <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Shift details</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
        {ph&&loc&&<><div style={{background:'#E1F5EE',borderRadius:8,padding:10,display:'flex',alignItems:'center',gap:9}}><Avatar p={ph} r={30}/><div><div style={{fontSize:12,fontWeight:500}}>{ph.name}</div><div style={{fontSize:11,color:'#085041'}}>OCP #{ph.ocp}</div></div></div>
        <div style={{background:'#E6F1FB',borderRadius:8,padding:10,display:'flex',alignItems:'center',gap:9}}><LocAvatar l={loc} r={30}/><div><div style={{fontSize:12,fontWeight:500}}>{loc.name}</div><div style={{fontSize:11,color:'#0C447C'}}>{loc.city}</div></div></div></>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
        {[['Date','date','date'],['Shift type','select','type'],['Start time','time','start'],['End time','time','end'],['Hourly rate ($)','number','rate'],['Urgency','select','urgency']].map(([label,type,key])=><div key={key}>
          <div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:500}}>{label}</div>
          {type==='select'&&key==='type'?<select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={S.inp}>{STYPES.map(s=><option key={s}>{s}</option>)}</select>:type==='select'&&key==='urgency'?<select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={S.inp}><option>Standard</option><option>Urgent (24h)</option><option>Emergency (ASAP)</option></select>:<input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={S.inp} placeholder={key==='rate'?ph?.rate?.toString():''}/>}
        </div>)}
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:4,fontWeight:500}}>Notes / requirements</div>
        <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Kroll required, bilingual preferred…" rows={3} style={{...S.inp,resize:'vertical'}}/>
      </div>
      {/* Fee estimate */}
      <div style={{background:'var(--color-background-secondary)',borderRadius:8,padding:12,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>Fee estimate</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8}}>
          {[['Hours',`${hours}h`],['Rate',`$${rate}/hr`],['Gross','$'+fmt(gross)],['Total + HST','$'+fmt(total,2)]].map(([l,v])=><div key={l}><div style={{fontSize:10,color:'var(--color-text-secondary)'}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:'#1D9E75'}}>{v}</div></div>)}
        </div>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>setStep(4)} disabled={!form.date} style={{...S.btnP,opacity:form.date?1:.5}}>Review &amp; confirm</button>
        <button onClick={()=>setStep(2)} style={S.btn()}>Back</button>
      </div>
    </div>}

    {/* Step 4 — Confirm */}
    {step===4&&ph&&loc&&<div style={S.card}>
      <button onClick={()=>setStep(3)} style={{...S.btn(),marginBottom:12,display:'flex',alignItems:'center',gap:5,fontSize:11}}><I n="arrow-left" sz={11}/>Back</button>
      <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Confirm booking</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[['Pharmacist',ph.name],['OCP Number',`#${ph.ocp}`],['Pharmacy',loc.name],['Location',`${loc.city}, ON ${loc.zip}`],['Date',form.date],['Time',`${form.start} – ${form.end} (${hours}h)`],['Shift type',form.type],['Urgency',form.urgency],['Hourly rate',`$${rate}`],['Total (incl HST)','$'+fmt(total,2)]].map(([l,v])=><div key={l} style={{background:'var(--color-background-secondary)',borderRadius:8,padding:10}}><div style={{fontSize:10,color:'var(--color-text-secondary)'}}>{l}</div><div style={{fontSize:12,fontWeight:500,marginTop:2}}>{v}</div></div>)}
      </div>
      {form.notes&&<div style={{background:'var(--color-background-secondary)',borderRadius:8,padding:10,marginBottom:14}}><div style={{fontSize:10,color:'var(--color-text-secondary)',marginBottom:3}}>Notes</div><div style={{fontSize:12}}>{form.notes}</div></div>}
      <div style={{display:'flex',gap:10}}>
        <button onClick={book} style={S.btnP}>Confirm booking</button>
        <button onClick={()=>setStep(3)} style={S.btn()}>Edit details</button>
      </div>
    </div>}
  </div>;
}

// ── Calendar ──────────────────────────────────────────────────────────────────
function CalendarView({bookings,setBookings}){
  const [month,setMonth]=useState({y:2026,m:5}); // 0-indexed June=5
  const [selectedDay,setSelectedDay]=useState(null);
  const [view,setView]=useState('month'); // month | week | list

  const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay=new Date(month.y,month.m,1).getDay();
  const daysInMonth=new Date(month.y,month.m+1,0).getDate();

  const dateStr=(d)=>`${month.y}-${String(month.m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const bookingsForDay=(d)=>bookings.filter(b=>b.date===dateStr(d));
  const bookingsForMonth=bookings.filter(b=>b.date.startsWith(`${month.y}-${String(month.m+1).padStart(2,'0')}`));

  const today='2026-06-03';

  const selDayBookings=selectedDay?bookingsForDay(selectedDay):[];

  function cancelBooking(id){setBookings(bs=>bs.map(b=>b.id===id?{...b,status:'Cancelled'}:b));}
  function confirmBooking(id){setBookings(bs=>bs.map(b=>b.id===id?{...b,status:'Confirmed'}:b));}

  return<div>
    <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Shift calendar</div>
    <p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>{bookingsForMonth.length} shifts scheduled this month · click any day to view and manage</p>

    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <button onClick={()=>setMonth(m=>m.m===0?{y:m.y-1,m:11}:{y:m.y,m:m.m-1})} style={{...S.btn(),padding:'5px 10px'}}><I n="chevron-left" sz={13}/></button>
        <span style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:500}}>{MONTHS[month.m]} {month.y}</span>
        <button onClick={()=>setMonth(m=>m.m===11?{y:m.y+1,m:0}:{y:m.y,m:m.m+1})} style={{...S.btn(),padding:'5px 10px'}}><I n="chevron-right" sz={13}/></button>
      </div>
      <div style={{display:'flex',gap:6}}>
        {['month','week','list'].map(v=><button key={v} onClick={()=>setView(v)} style={{...S.btn(view===v?'#E1F5EE':'transparent',view===v?'#0F6E56':'var(--color-text-secondary)',view===v?'#1D9E75':'var(--color-border-secondary)'),fontSize:11,padding:'4px 12px',borderRadius:20,textTransform:'capitalize'}}>{v}</button>)}
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:selectedDay?'1fr 300px':'1fr',gap:14}}>
      <div>
        {view==='month'&&<div style={S.card}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:6}}>
            {DAYS.map(d=><div key={d} style={{fontSize:10,color:'var(--color-text-secondary)',textAlign:'center',padding:'4px 0',fontWeight:500}}>{d}</div>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
            {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const d=i+1;
              const ds=dateStr(d);
              const dayBks=bookingsForDay(d);
              const isToday=ds===today;
              const isSel=selectedDay===d;
              return<div key={d} onClick={()=>setSelectedDay(isSel?null:d)} style={{borderRadius:8,padding:'5px 4px',minHeight:60,border:`${isSel?'1.5px':'0.5px'} solid ${isSel?'#1D9E75':isToday?'#378ADD':'var(--color-border-tertiary)'}`,background:isSel?'#E1F5EE':dayBks.length?'var(--color-background-secondary)':'var(--color-background-primary)',cursor:'pointer'}}>
                <div style={{fontSize:11,fontWeight:isToday?600:400,color:isToday?'#185FA5':'var(--color-text-primary)',textAlign:'right',marginBottom:3}}>{d}</div>
                {dayBks.slice(0,2).map(b=>{const ph=PHARMACISTS.find(p=>p.id===b.pharmacistId);return ph?<div key={b.id} style={{fontSize:9,padding:'1px 4px',borderRadius:3,background:b.status==='Confirmed'?'#1D9E75':b.status==='Pending'?'#BA7517':'#A32D2D',color:'#fff',marginBottom:1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{ph.initials} {b.start}</div>:null;})}
                {dayBks.length>2&&<div style={{fontSize:9,color:'var(--color-text-secondary)',textAlign:'center'}}>+{dayBks.length-2}</div>}
              </div>;
            })}
          </div>
          <div style={{display:'flex',gap:14,marginTop:10,fontSize:10,color:'var(--color-text-secondary)'}}>
            {[['#1D9E75','Confirmed'],['#BA7517','Pending'],['#A32D2D','Cancelled']].map(([c,l])=><span key={l} style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:10,height:10,borderRadius:3,background:c,display:'inline-block'}}/>{l}</span>)}
          </div>
        </div>}

        {view==='list'&&<div style={S.card}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:12}}>All bookings — {MONTHS[month.m]} {month.y}</div>
          {bookingsForMonth.length===0&&<div style={{textAlign:'center',padding:32,color:'var(--color-text-secondary)',fontSize:13}}>No bookings this month</div>}
          {bookingsForMonth.sort((a,b)=>a.date.localeCompare(b.date)).map(b=>{
            const ph=PHARMACISTS.find(p=>p.id===b.pharmacistId);
            const loc=LOCATIONS.find(l=>l.id===b.locationId);
            if(!ph||!loc) return null;
            return<div key={b.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
              <Avatar p={ph} r={34}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500}}>{ph.name} → {loc.name.substring(0,20)}</div>
                <div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{b.date} · {b.start}–{b.end} · {b.type} · ${b.rate}/hr</div>
              </div>
              <Pill status={b.status}/>
              {b.status==='Pending'&&<button onClick={()=>confirmBooking(b.id)} style={{...S.btn('#E1F5EE','#085041','#1D9E75'),fontSize:10,padding:'3px 9px'}}>Confirm</button>}
              {b.status!=='Cancelled'&&<button onClick={()=>cancelBooking(b.id)} style={{...S.btn('#FCEBEB','#791F1F','#A32D2D'),fontSize:10,padding:'3px 9px'}}>Cancel</button>}
            </div>;
          })}
        </div>}

        {view==='week'&&<div style={S.card}>
          <div style={{fontSize:12,fontWeight:500,marginBottom:12}}>Week of Jun 1–7, 2026</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
            {Array(7).fill(null).map((_,i)=>{const d=i+1;const dayBks=bookingsForDay(d);return<div key={d} style={{minHeight:120,borderRadius:8,border:'0.5px solid var(--color-border-tertiary)',padding:6,background:d===3?'#E6F1FB':'var(--color-background-secondary)'}}>
              <div style={{fontSize:11,fontWeight:d===3?600:400,color:d===3?'#185FA5':'var(--color-text-primary)',marginBottom:4}}>{DAYS[new Date(2026,5,d).getDay()]} {d}</div>
              {dayBks.map(b=>{const ph=PHARMACISTS.find(p=>p.id===b.pharmacistId);return ph?<div key={b.id} style={{fontSize:9,padding:'2px 5px',borderRadius:4,background:b.status==='Confirmed'?'#1D9E75':'#BA7517',color:'#fff',marginBottom:2}}><div style={{fontWeight:600}}>{ph.name.split(' ')[0]}</div><div>{b.start}–{b.end}</div></div>:null;})}
              {dayBks.length===0&&<div style={{fontSize:9,color:'var(--color-text-secondary)',marginTop:8,textAlign:'center'}}>Open</div>}
            </div>;})}
          </div>
        </div>}
      </div>

      {/* Day detail panel */}
      {selectedDay&&<div style={S.card}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Jun {selectedDay}, 2026</div>
        {selDayBookings.length===0?<div style={{textAlign:'center',padding:20,color:'var(--color-text-secondary)',fontSize:12}}>No shifts booked<br/><button style={{...S.btnP,marginTop:12,fontSize:11}}>Book a shift</button></div>:
        selDayBookings.map(b=>{
          const ph=PHARMACISTS.find(p=>p.id===b.pharmacistId);
          const loc=LOCATIONS.find(l=>l.id===b.locationId);
          if(!ph||!loc) return null;
          const hrs=parseInt(b.end)-parseInt(b.start);
          return<div key={b.id} style={{background:'var(--color-background-secondary)',borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{display:'flex',gap:9,alignItems:'center',marginBottom:8}}>
              <Avatar p={ph} r={32}/>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{ph.name}</div><div style={{fontSize:10,color:'var(--color-text-secondary)'}}>{ph.type} · OCP #{ph.ocp}</div></div>
              <Pill status={b.status}/>
            </div>
            <div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:3}}><I n="building-hospital" sz={11}/> {loc.name}</div>
            <div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:3}}><I n="clock" sz={11}/> {b.start}–{b.end} ({hrs}h) · {b.type}</div>
            <div style={{fontSize:11,fontWeight:500,color:'#1D9E75',marginBottom:8}}>${b.rate}/hr · ${b.rate*hrs} gross · ${(b.rate*hrs*1.13).toFixed(0)} incl HST</div>
            {b.notes&&<div style={{fontSize:10,color:'var(--color-text-secondary)',fontStyle:'italic',marginBottom:8}}>"{b.notes}"</div>}
            <div style={{display:'flex',gap:6}}>
              {b.status==='Pending'&&<button onClick={()=>confirmBooking(b.id)} style={{...S.btn('#E1F5EE','#085041','#1D9E75'),fontSize:10,padding:'3px 9px'}}>Confirm</button>}
              {b.status!=='Cancelled'&&<button onClick={()=>cancelBooking(b.id)} style={{...S.btn('#FCEBEB','#791F1F','#A32D2D'),fontSize:10,padding:'3px 9px'}}>Cancel</button>}
            </div>
          </div>;
        })}
      </div>}
    </div>
  </div>;
}

// ── Pharmacists ───────────────────────────────────────────────────────────────
function Pharmacists(){
  const [search,setSearch]=useState('');
  const [typeF,setTypeF]=useState('All');
  const [availF,setAvailF]=useState(false);
  const [selected,setSelected]=useState(null);
  const filtered=useMemo(()=>{let d=PHARMACISTS;if(search)d=d.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.ocp.includes(search)||p.specialties.some(s=>s.toLowerCase().includes(search.toLowerCase())));if(typeF!=='All')d=d.filter(p=>p.type===typeF);if(availF)d=d.filter(p=>p.available);return d;},[search,typeF,availF]);
  if(selected){const p=selected;return<div><button onClick={()=>setSelected(null)} style={{...S.btn(),marginBottom:14,display:'flex',alignItems:'center',gap:5,fontSize:11}}><I n="arrow-left" sz={11}/>Back</button><div style={S.card}><div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:16}}><Avatar p={p} r={52}/><div style={{flex:1}}><div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:500}}>{p.name}</div><div style={{fontSize:12,color:'var(--color-text-secondary)',marginTop:2}}>{p.type} · {p.yrs} yrs · OCP #{p.ocp}</div><div style={{display:'flex',gap:6,marginTop:7,flexWrap:'wrap'}}><span style={S.vb}><I n="shield-check" sz={9}/>OCP Verified</span>{p.injection&&<span style={{...S.vb,background:'#E6F1FB',color:'#0C447C'}}><I n="vaccine" sz={9}/>Injection Cert</span>}<Pill status={p.available?'Available':'Pending'}/></div></div><div style={{textAlign:'right'}}><div style={{fontSize:20,fontWeight:600,color:'#1D9E75'}}>${p.rate}/hr</div><div style={{fontSize:11,color:'var(--color-text-secondary)',marginTop:2}}>★{p.rating} · {p.shifts} shifts</div></div></div><div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:14}}>{p.specialties.map(s=><span key={s} style={S.tag}>{s}</span>)}</div><div style={{display:'flex',gap:8}}><button style={S.btnP}>Book shift</button><button style={S.btn()}>Message</button></div></div></div>;}
  return<div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Pharmacist directory</div><p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>{PHARMACISTS.length} OCP active members · {PHARMACISTS.filter(p=>p.available).length} available now</p><div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}><SearchBar value={search} onChange={setSearch} placeholder="Search name, OCP #, specialty…"/>{['All','Pharmacist','Pharmacy Technician'].map(o=><button key={o} onClick={()=>setTypeF(o)} style={{...S.btn(typeF===o?'#E1F5EE':'transparent',typeF===o?'#0F6E56':'var(--color-text-secondary)',typeF===o?'#1D9E75':'var(--color-border-secondary)'),fontSize:11,padding:'4px 11px',borderRadius:20}}>{o}</button>)}<label style={{fontSize:12,color:'var(--color-text-secondary)',display:'flex',alignItems:'center',gap:5,cursor:'pointer'}}><input type="checkbox" checked={availF} onChange={e=>setAvailF(e.target.checked)}/>Available only</label></div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>{filtered.slice(0,20).map(p=><div key={p.id} onClick={()=>setSelected(p)} style={{...S.card,cursor:'pointer',padding:12}} onMouseEnter={e=>e.currentTarget.style.borderColor='#1D9E75'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border-tertiary)'}><div style={{display:'flex',gap:9,alignItems:'center',marginBottom:8}}><Avatar p={p} r={34}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{p.type}</div></div><div style={{fontSize:13,fontWeight:600,color:'#1D9E75'}}>${p.rate}/hr</div></div><div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:7}}>{p.specialties.map(s=><span key={s} style={S.tag}>{s}</span>)}{p.injection&&<span style={{...S.tag,background:'#E6F1FB',color:'#0C447C',border:'0.5px solid #B5D4F4'}}>Injection</span>}</div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={S.vb}><I n="shield-check" sz={9}/>OCP #{p.ocp}</span><Pill status={p.available?'Available':'Pending'}/></div></div>)}</div>{filtered.length>20&&<p style={{fontSize:11,color:'var(--color-text-secondary)',textAlign:'center',marginTop:10}}>{filtered.length-20} more — refine search</p>}</div>;
}

// ── Locations ─────────────────────────────────────────────────────────────────
function Locations(){
  const [search,setSearch]=useState('');
  const filtered=useMemo(()=>LOCATIONS.filter(l=>l.name.toLowerCase().includes(search.toLowerCase())||l.city.toLowerCase().includes(search.toLowerCase())),[search]);
  return<div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Pharmacy locations</div><p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>{LOCATIONS.length} OCP-accredited pharmacies loaded</p><div style={{marginBottom:12}}><SearchBar value={search} onChange={setSearch} placeholder="Search pharmacy or city…"/></div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>{filtered.map(l=><div key={l.id} style={{...S.card,padding:12}}><div style={{display:'flex',gap:9,alignItems:'flex-start',marginBottom:8}}><LocAvatar l={l} r={36}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{l.name}</div><div style={{fontSize:11,color:'var(--color-text-secondary)',marginTop:2}}>{l.address}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{l.city}, ON {l.zip}</div></div>{l.open_shifts>0&&<span style={S.pill('#FAEEDA','#633806')}>{l.open_shifts} open</span>}</div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4}}><div style={{display:'flex',gap:5}}><span style={S.vb}><I n="shield-check" sz={9}/>#{l.id}</span><span style={S.tag}>{l.shift_type}</span></div><div style={{fontSize:11,color:'var(--color-text-secondary)',display:'flex',alignItems:'center',gap:5}}><I n="phone" sz={11}/>{l.phone}<span style={{fontWeight:600,color:'#1D9E75'}}>${l.rate}/hr</span></div></div></div>)}</div></div>;
}

// ── Messaging ─────────────────────────────────────────────────────────────────
function Messaging(){
  const [msgs,setMsgs]=useState([{id:1,from:"Acacia Pharmacy",to:"Priya Arora",subject:"Coverage needed Sat Jun 7",read:false,thread:[{s:"Acacia Pharmacy",b:"Hi Priya, we have a dispensary shift open this Saturday 8am–4pm. Would you be available? Rate is $74/hr.",t:"10:32 AM"},{s:"Priya Arora",b:"Hello! I'm available that day. Please confirm and I'll add it to my schedule.",t:"10:45 AM"}]},{id:2,from:"Action Pharmacy",to:"Goutham Kumar",subject:"Urgent: Tomorrow morning coverage",read:true,thread:[{s:"Action Pharmacy",b:"We need emergency coverage tomorrow 9am–5pm. Compounding preferred. $88/hr.",t:"Yesterday"},{s:"Goutham Kumar",b:"I can cover it. Please send the address.",t:"Yesterday 4pm"}]},{id:3,from:"Aldershot Pharmacy",to:"Indu",subject:"Relief contract discussion",read:true,thread:[{s:"Aldershot Pharmacy",b:"We'd like to set up a call regarding ongoing relief coverage at our Burlington location.",t:"Jun 1"}]}]);
  const [cur,setCur]=useState(msgs[0]);const [reply,setReply]=useState('');
  function send(){if(!reply.trim())return;setMsgs(ms=>ms.map(m=>m.id===cur.id?{...m,thread:[...m.thread,{s:'Agency',b:reply,t:'Now'}]}:m));setCur(c=>({...c,thread:[...c.thread,{s:'Agency',b:reply,t:'Now'}]}));setReply('');}
  return<div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Messaging</div><p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>Direct communication between pharmacists and locations</p><div style={{display:'grid',gridTemplateColumns:'240px 1fr',border:'0.5px solid var(--color-border-tertiary)',borderRadius:12,overflow:'hidden',background:'var(--color-background-primary)'}}><div style={{borderRight:'0.5px solid var(--color-border-tertiary)'}}><div style={{padding:'10px 12px',borderBottom:'0.5px solid var(--color-border-tertiary)',fontSize:12,fontWeight:500}}>Inbox</div>{msgs.map(m=><div key={m.id} onClick={()=>{setCur(m);setMsgs(ms=>ms.map(x=>x.id===m.id?{...x,read:true}:x));}} style={{padding:'10px 12px',borderBottom:'0.5px solid var(--color-border-tertiary)',cursor:'pointer',background:m.id===cur.id?'#E1F5EE':'transparent'}}><div style={{fontSize:11,fontWeight:m.read?400:600}}>{m.from}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{m.subject}</div>{!m.read&&<span style={{width:6,height:6,background:'#E24B4A',borderRadius:'50%',display:'inline-block',marginTop:3}}/>}</div>)}</div><div style={{display:'flex',flexDirection:'column'}}><div style={{padding:'11px 14px',borderBottom:'0.5px solid var(--color-border-tertiary)'}}><div style={{fontSize:13,fontWeight:500}}>{cur.subject}</div><div style={{fontSize:11,color:'var(--color-text-secondary)'}}>{cur.from} → {cur.to}</div></div><div style={{flex:1,padding:14,display:'flex',flexDirection:'column',gap:9,minHeight:200,maxHeight:300,overflowY:'auto'}}>{cur.thread.map((t,i)=><div key={i} style={{display:'flex',flexDirection:'column',alignItems:t.s==='Agency'||t.s.includes('Pharmacy')?'flex-end':'flex-start'}}><div style={{maxWidth:'76%',borderRadius:10,padding:'8px 12px',fontSize:12,background:t.s==='Agency'||t.s.includes('Pharmacy')?'#1D9E75':'var(--color-background-secondary)',color:t.s==='Agency'||t.s.includes('Pharmacy')?'#fff':'var(--color-text-primary)'}}><div style={{fontSize:10,opacity:.7,marginBottom:3}}>{t.s} · {t.t}</div>{t.b}</div></div>)}</div><div style={{padding:'10px 14px',borderTop:'0.5px solid var(--color-border-tertiary)',display:'flex',gap:8'}}><input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a reply…" style={{...S.inp,flex:1}}/><button onClick={send} style={S.btnP}>Send</button></div></div></div></div>;
}

// ── Payroll ───────────────────────────────────────────────────────────────────
function Payroll(){
  const [recs,setRecs]=useState(PHARMACISTS.filter(p=>p.payroll_pending>0).map((p,i)=>({id:`PAY-${1001+i}`,pharmacist:p.name,pharmacy:LOCATIONS[i%LOCATIONS.length].name,date:`Jun ${(i%28)+1}, 2026`,hours:8+(i%4),rate:p.rate,gross:p.rate*(8+(i%4)),hst:parseFloat((p.rate*(8+(i%4))*.13).toFixed(2)),net:parseFloat((p.rate*(8+(i%4))*1.13).toFixed(2)),status:i%3===0?'Paid':i%3===1?'Pending':'Processing'})));
  const [search,setSearch]=useState('');const [sf,setSf]=useState('All');
  const filtered=useMemo(()=>{let d=recs;if(search)d=d.filter(r=>r.pharmacist.toLowerCase().includes(search.toLowerCase())||r.id.toLowerCase().includes(search.toLowerCase()));if(sf!=='All')d=d.filter(r=>r.status===sf);return d;},[search,sf,recs]);
  const totPend=recs.filter(r=>r.status==='Pending').reduce((a,r)=>a+r.net,0);
  const totPaid=recs.filter(r=>r.status==='Paid').reduce((a,r)=>a+r.net,0);
  return<div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Payroll</div><p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>HST-inclusive compensation · 13% HST applied</p><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>{[['Pending','$'+Math.round(totPend).toLocaleString(),'#BA7517'],['Paid this month','$'+Math.round(totPaid).toLocaleString(),'#1D9E75'],['Pending invoices',recs.filter(r=>r.status==='Pending').length,'#BA7517'],['Processing',recs.filter(r=>r.status==='Processing').length,'#185FA5']].map(([l,v,c])=><div key={l} style={S.metric}><div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:4}}>{l}</div><div style={{fontSize:18,fontWeight:600,color:c}}>{v}</div></div>)}</div><div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}><SearchBar value={search} onChange={setSearch} placeholder="Search…"/>{['All','Pending','Processing','Paid'].map(o=><button key={o} onClick={()=>setSf(o)} style={{...S.btn(sf===o?'#E1F5EE':'transparent',sf===o?'#0F6E56':'var(--color-text-secondary)',sf===o?'#1D9E75':'var(--color-border-secondary)'),fontSize:11,padding:'4px 11px',borderRadius:20}}>{o}</button>)}</div><div style={{...S.card,padding:0,overflow:'hidden'}}><div style={{overflowX:'auto'}}><table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}><thead style={{background:'var(--color-background-secondary)'}}><tr>{['Invoice','Pharmacist','Pharmacy','Date','Hrs','Rate','Gross','HST','Total','Status','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 9px',fontWeight:500,color:'var(--color-text-secondary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>{h}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}><td style={{padding:'7px 9px',color:'var(--color-text-secondary)'}}>{r.id}</td><td style={{padding:'7px 9px',fontWeight:500}}>{r.pharmacist}</td><td style={{padding:'7px 9px',color:'var(--color-text-secondary)'}}>{r.pharmacy.substring(0,15)}</td><td style={{padding:'7px 9px'}}>{r.date}</td><td style={{padding:'7px 9px'}}>{r.hours}h</td><td style={{padding:'7px 9px'}}>${r.rate}</td><td style={{padding:'7px 9px'}}>${r.gross.toLocaleString()}</td><td style={{padding:'7px 9px',color:'var(--color-text-secondary)'}}>${r.hst.toFixed(2)}</td><td style={{padding:'7px 9px',fontWeight:500}}>${r.net.toLocaleString()}</td><td style={{padding:'7px 9px'}}><Pill status={r.status}/></td><td style={{padding:'7px 9px'}}>{r.status==='Pending'&&<button onClick={()=>setRecs(rs=>rs.map(x=>x.id===r.id?{...x,status:'Paid'}:x))} style={{...S.btn('#E1F5EE','#085041','#1D9E75'),fontSize:10,padding:'2px 8px'}}>Mark paid</button>}</td></tr>)}</tbody></table></div></div></div>;
}

// ── Credentialing ─────────────────────────────────────────────────────────────
function Credentialing(){
  const CRED_ST=['Verified','Pending Review','Expired','Suspended'];
  const CRED=Object.fromEntries(PHARMACISTS.map((p,i)=>[p.id,{status:CRED_ST[i%4===3?3:i%4===2&&p.shifts<10?2:i%4===1&&i<8?1:0],lastVerified:`${['Jan','Feb','Mar','Apr','May','Jun'][i%6]} ${10+(i%18)}, 2026`,expires:`${['Dec','Nov','Oct','Sep'][i%4]} 31, 2026`}]));
  const [search,setSearch]=useState('');const [cf,setCf]=useState('All');const [ver,setVer]=useState({});
  const filtered=useMemo(()=>{let d=PHARMACISTS;if(search)d=d.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.ocp.includes(search));if(cf!=='All')d=d.filter(p=>CRED[p.id].status===cf);return d;},[search,cf]);
  const counts=CRED_ST.reduce((a,s)=>{a[s]=PHARMACISTS.filter(p=>CRED[p.id].status===s).length;return a;},{});
  function doVerify(id){setVer(v=>({...v,[id]:'checking'}));setTimeout(()=>setVer(v=>({...v,[id]:'done'})),1400);}
  return<div><div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:500,marginBottom:3}}>Credentialing</div><p style={{fontSize:12,color:'var(--color-text-secondary)',marginBottom:14}}>OCP registration cross-referenced against Ontario College of Pharmacists public registry</p><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>{[['Verified','#1D9E75'],['Pending Review','#BA7517'],['Expired','#A32D2D'],['Suspended','#791F1F']].map(([s,c])=><div key={s} onClick={()=>setCf(cf===s?'All':s)} style={{...S.metric,borderLeft:`3px solid ${c}`,cursor:'pointer'}}><div style={{fontSize:11,color:'var(--color-text-secondary)',marginBottom:4}}>{s}</div><div style={{fontSize:20,fontWeight:600,color:c}}>{counts[s]}</div></div>)}</div><div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}><SearchBar value={search} onChange={setSearch} placeholder="Search name or OCP…"/>{['All',...CRED_ST].map(o=><button key={o} onClick={()=>setCf(o)} style={{...S.btn(cf===o?'#E1F5EE':'transparent',cf===o?'#0F6E56':'var(--color-text-secondary)',cf===o?'#1D9E75':'var(--color-border-secondary)'),fontSize:11,padding:'4px 11px',borderRadius:20,whiteSpace:'nowrap'}}>{o}</button>)}</div><div style={{...S.card,padding:0,overflow:'hidden'}}><div style={{overflowX:'auto'}}><table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}><thead style={{background:'var(--color-background-secondary)'}}><tr>{['Name','OCP #','Type','Injection','Status','Verified','Expires','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 9px',fontWeight:500,color:'var(--color-text-secondary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>{h}</th>)}</tr></thead><tbody>{filtered.slice(0,25).map(p=>{const c=CRED[p.id];return<tr key={p.id} style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}><td style={{padding:'7px 9px'}}><div style={{display:'flex',alignItems:'center',gap:7}}><Avatar p={p} r={24}/><span style={{fontWeight:500}}>{p.name}</span></div></td><td style={{padding:'7px 9px',color:'var(--color-text-secondary)'}}>{p.ocp}</td><td style={{padding:'7px 9px'}}>{p.type.replace('Pharmacy ','Pharm. ')}</td><td style={{padding:'7px 9px'}}>{p.injection?<span style={{color:'#1D9E75'}}>✓</span>:<span style={{color:'var(--color-text-secondary)'}}>—</span>}</td><td style={{padding:'7px 9px'}}><Pill status={c.status==='Verified'?'Confirmed':c.status}/></td><td style={{padding:'7px 9px',color:'var(--color-text-secondary)'}}>{c.lastVerified}</td><td style={{padding:'7px 9px'}}>{c.expires}</td><td style={{padding:'7px 9px'}}><button onClick={()=>doVerify(p.id)} style={{...S.btn(ver[p.id]==='done'?'#E1F5EE':'transparent',ver[p.id]==='done'?'#085041':'var(--color-text-secondary)',ver[p.id]==='done'?'#1D9E75':'var(--color-border-secondary)'),fontSize:10,padding:'2px 8px'}}>{ver[p.id]==='checking'?'Checking…':ver[p.id]==='done'?'✓ Verified':'Verify'}</button></td></tr>;})}</tbody></table></div></div>{filtered.length>25&&<p style={{fontSize:11,color:'var(--color-text-secondary)',textAlign:'center',marginTop:8}}>{filtered.length-25} more — search to narrow</p>}</div>;
}

// ── Root ──────────────────────────────────────────────────────────────────────
const PANELS=[
  {id:'dashboard',label:'Dashboard',icon:'layout-dashboard'},
  {id:'booking',label:'Book a Shift',icon:'calendar-plus'},
  {id:'calendar',label:'Calendar',icon:'calendar-month'},
  {id:'pharmacists',label:'Pharmacists',icon:'users'},
  {id:'locations',label:'Locations',icon:'building-hospital'},
  {id:'messaging',label:'Messaging',icon:'message-dots'},
  {id:'payroll',label:'Payroll',icon:'coin'},
  {id:'credentialing',label:'Credentialing',icon:'shield-check'},
];

export default function App(){
  const [panel,setPanel]=useState('dashboard');
  const [bookings,setBookings]=useState(SEED_BOOKINGS);

  const content={
    dashboard:<Dashboard bookings={bookings} onNav={setPanel}/>,
    booking:<ShiftBooking bookings={bookings} setBookings={setBookings}/>,
    calendar:<CalendarView bookings={bookings} setBookings={setBookings}/>,
    pharmacists:<Pharmacists/>,
    locations:<Locations/>,
    messaging:<Messaging/>,
    payroll:<Payroll/>,
    credentialing:<Credentialing/>,
  }[panel];

  return <>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
    <div style={S.wrap}>
      <div style={S.bar}>
        <div style={S.logo}><I n="pill" sz={20} col="#5DCAA5"/>PharmRelief<span style={{fontSize:10,background:'rgba(255,255,255,.1)',padding:'2px 8px',borderRadius:20,color:'#9FE1CB',marginLeft:4}}>OCP-verified</span></div>
        <span style={{fontSize:11,color:'#5DCAA5'}}>{PHARMACISTS.length} pharmacists · {LOCATIONS.length} locations · {bookings.length} bookings</span>
      </div>
      <div style={S.nav}>
        {PANELS.map(p=><button key={p.id} onClick={()=>setPanel(p.id)} style={S.nb(panel===p.id)}>
          <I n={p.icon} sz={13} col={panel===p.id?'#0F6E56':'var(--color-text-secondary)'}/>{p.label}
          {p.id==='messaging'&&<span style={{width:6,height:6,background:'#E24B4A',borderRadius:'50%',display:'inline-block'}}/>}
        </button>)}
      </div>
      <div style={S.content}>{content}</div>
    </div>
  </>;
}
