
"use strict";const $=id=>document.getElementById(id);function storage(k,v){try{if(v!==undefined)localStorage.setItem(k,v);return localStorage.getItem(k)}catch{return null}}let gift=new URLSearchParams(location.search).get("gift")==="gold-demo";if(gift){storage("tar3dGold","1");$("giftNote").hidden=false;$("giftNote").textContent="Подарок открыт: TAR Gold Edition (демо)"}let hasGold=gift||storage("tar3dGold")==="1";if(hasGold){$("paint").options[1].disabled=false;$("paint").value="gold"}function fail(){ $("desc").textContent="Не удалось запустить 3D. Проверь интернет или открой классические гонки."; $("start").disabled=true }try{if(!window.BABYLON)throw Error("engine unavailable");init()}catch(e){console.error(e);fail()}
function init(){const B=BABYLON,canvas=$("view"),engine=new B.Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,adaptToDeviceRatio:false});engine.setHardwareScalingLevel(Math.max(1,Math.min(2,devicePixelRatio/1.25||1)));const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.095,.15,.245,1);scene.fogMode=B.Scene.FOGMODE_EXP2;scene.fogDensity=.010;scene.fogColor=new B.Color3(.07,.09,.16);const V=(x,y,z)=>new B.Vector3(x,y,z),C=(r,g,b)=>new B.Color3(r,g,b);let camera=new B.FreeCamera("chase",V(0,4.2,-8.8),scene);camera.setTarget(V(0,1.2,15));camera.minZ=.1;camera.maxZ=300;camera.fov=.92;const ambient=new B.HemisphericLight("sky",V(0,1,0),scene);ambient.intensity=.57;ambient.groundColor=C(.13,.16,.25);const key=new B.DirectionalLight("key",V(-.5,-1,.6),scene);key.intensity=.96;key.diffuse=C(.56,.75,1);const rim=new B.DirectionalLight("rim",V(.8,-.3,-.5),scene);rim.diffuse=C(1,.35,.25);rim.intensity=.7;
scene.environmentTexture=B.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env",scene);scene.environmentIntensity=.9;const glow=new B.GlowLayer("neonGlow",scene,{mainTextureRatio:.4,blurKernelSize:32});glow.intensity=.65;scene.imageProcessingConfiguration.contrast=1.28;scene.imageProcessingConfiguration.exposure=.89;function quality(){let q=$("quality").value;engine.setHardwareScalingLevel(q==="low"?2:q==="high"?1:1.15);glow.isEnabled=q!=="low";glow.intensity=q==="high"?.30:.22}$("quality").onchange=quality;quality();
function mat(name,color,shine=0,emit=0){if(["blue","gold","alloy"].includes(name)&&!emit){let p=new B.PBRMaterial(name,scene);p.albedoColor=color;p.metallic=name==="alloy"?.95:.72;p.roughness=.24;p.clearCoat.isEnabled=true;p.clearCoat.intensity=.9;p.clearCoat.roughness=.12;return p}let m=new B.StandardMaterial(name,scene);m.diffuseColor=color;m.specularColor=C(shine,shine,shine);m.specularPower=64;if(emit)m.emissiveColor=color.scale(emit);return m}const asphalt=mat("asphalt",C(.075,.085,.105),.36),ground=mat("ground",C(.035,.043,.065)),line=mat("lane",C(.48,.47,.43),.05,.03),edge=mat("edge",C(.2,.65,.95),.1,.7),tire=mat("rubber",C(.025,.03,.035)),metal=mat("alloy",C(.55,.58,.62),.8),glass=mat("glass",C(.04,.1,.16),.9),red=mat("tail",C(1,.04,.08),.1,1.2),white=mat("head",C(.7,.85,1),.1,1.3),blue=mat("nitro",C(.05,.7,1),.1,1.6),black=mat("trim",C(.025,.03,.04),.35),gold=mat("gold",C(.82,.49,.11),.95),paint=mat("blue",C(.04,.22,.65),.95);
function box(n,w,h,d,x,y,z,m,parent){let q=B.MeshBuilder.CreateBox(n,{width:w,height:h,depth:d},scene);q.position=V(x,y,z);q.material=m;if(parent)q.parent=parent;return q}box("base",250,.15,260,0,-.17,100,ground);const roadMesh=box("road",10.6,.12,260,0,-.07,100,asphalt);
const tex=new B.DynamicTexture("wet asphalt",{width:512,height:512},scene,false);let ctx=tex.getContext();ctx.fillStyle="#222831";ctx.fillRect(0,0,512,512);let seed=17;function rand(){seed=(seed*16807)%2147483647;return seed/2147483647}for(let i=0;i<24000;i++){let v=28+Math.floor(rand()*35);ctx.fillStyle="rgb("+v+","+v+","+(v+4)+")";ctx.fillRect(rand()*512,rand()*512,1+rand()*2,1+rand()*2)}for(let i=0;i<65;i++){let x=rand()*512,y=rand()*512;let gr=ctx.createLinearGradient(x,y,x,y+35);gr.addColorStop(0,"#758da020");gr.addColorStop(1,"#00000000");ctx.fillStyle=gr;ctx.fillRect(x,y,3+rand()*14,35)}tex.update();tex.uScale=3;tex.vScale=50;asphalt.diffuseTexture=tex;asphalt.diffuseColor=C(.8,.85,.95);asphalt.specularColor=C(.9,.9,.9);asphalt.specularPower=90;
// Continuous road surface follows the same centreline as the scenery and traffic.
roadMesh.dispose();
const ribbon = B.MeshBuilder.CreateGround("wet boulevard", {width:10.9,height:264,subdivisionsX:1,subdivisionsY:88,updatable:true}, scene);
ribbon.position.z=106;
ribbon.material=asphalt;
ribbon.alwaysSelectAsActiveMesh=true;
const surface=ribbon.getVerticesData(B.VertexBuffer.PositionKind);
const originalSurface=surface.slice();
const mirror=new B.MirrorTexture("street reflections",256,scene,true);
mirror.mirrorPlane=new B.Plane(0,-1,0,.006);
mirror.blurKernel=4;
mirror.level=.29;
asphalt.reflectionTexture=mirror;
$("roadAsset").textContent="Мокрый бульвар";
function centerAt(s){return 19*Math.sin(s/55-.85);}
function tangent(s){return 19/55*Math.cos(s/55-.85);}
function offsetAt(s,z){return centerAt(s+z)-centerAt(s)-z*tangent(s);}
function placeBlock(root,s){
 const z=root.position.z;
 root.position.x=offsetAt(s,z);
 root.rotation.y=Math.atan(tangent(s+z)-tangent(s));
}
function bendStreet(s){
 for(let i=0;i<surface.length;i+=3){
   const z=originalSurface[i+2]+106;
   surface[i]=originalSurface[i]+offsetAt(s,z);
 }
 ribbon.updateVerticesData(B.VertexBuffer.PositionKind,surface);
 asphaltColor.vOffset=asphaltNormal.vOffset=-s/264*asphaltColor.vScale;
 for(const root of road)placeBlock(root,s);
 for(const root of buildings)placeBlock(root,s);
}
const asphaltColor=new B.Texture("assets/texture0.jpg",scene);
const asphaltNormal=new B.Texture("assets/texture1.jpg",scene);
for(const map of [asphaltColor,asphaltNormal]){map.uScale=3.8;map.vScale=95;map.anisotropicFilteringLevel=8;}
asphalt.diffuseTexture=asphaltColor;asphalt.bumpTexture=asphaltNormal;
asphaltNormal.level=.18;asphalt.diffuseColor=C(.24,.24,.25);asphalt.specularColor=C(.46,.47,.48);
const masonry=mat("stone paving",C(.12,.13,.15),.13);
const streetPole=mat("iron",C(.11,.13,.14),.18);
const stripe=mat("worn yellow paint",C(.67,.49,.20),.12);
const road=[],buildings=[];
for(let i=0;i<32;i++){
 const root=new B.TransformNode("street "+i,scene);root.position.z=i*8-16;
 const crossing=i%16===5;
 for(const side of [-1,1]){
   if(!crossing){
     box("centre line",.062,.008,8.05,-1.75+side*.10,.012,0,stripe,root);
     if(side>0)box("lane dash",.096,.01,2.7,side*1.75,.014,0,line,root);
   }
   box("sidewalk",2.58,.14,8.85,side*6.64,.007,0,masonry,root);
   if(i%3===1){
     box("lamp post",.085,5.5,.085,side*6.15,2.75,0,streetPole,root);
     box("lamp arm",1.2,.085,.12,side*5.6,5.48,0,streetPole,root);
     box("lamp",.60,.085,.32,side*5.14,5.42,0,white,root);
   }
 }
 if(crossing){
  for(let x=-4.8;x<5.1;x+=.88)box("crosswalk",.45,.009,2.25,x,.018,0,line,root);
 }
 road.push(root);
}
const facadeMaterials=['assets/texture2.jpg', 'assets/texture3.jpg', 'assets/texture4.jpg'].map((url,i)=>{
 const m=new B.StandardMaterial("facade "+i,scene),t=new B.Texture(url,scene);
 t.anisotropicFilteringLevel=8;m.diffuseTexture=t;m.emissiveTexture=t;m.emissiveColor=C(.23,.23,.24);
 m.diffuseColor=C(.33,.33,.35);m.specularColor=C(.025,.025,.025);return m;
});
function facadeUV(mesh, width, height, depth, upper=false){
 const pos=mesh.getVerticesData(B.VertexBuffer.PositionKind),norm=mesh.getVerticesData(B.VertexBuffer.NormalKind),uv=[];
 for(let i=0;i<pos.length;i+=3){
  const u=Math.abs(norm[i])>.5?pos[i+2]*Math.sign(norm[i])/depth:-pos[i]*Math.sign(norm[i+2])/width;
  const v=pos[i+1]/height+.5;uv.push(.5+u,upper?.49+.49*v:v);
 }
 mesh.setVerticesData(B.VertexBuffer.UVKind,uv);
}
// Window illumination is baked once per district. Dark floors stay dark under street lights.
const officeMaterials = Array.from({length:3},(_,style)=>{
 const t=new B.DynamicTexture("office windows",{width:256,height:512},scene,true);
 const g=t.getContext(); g.fillStyle=["#25303b","#302f34","#22333b"][style];g.fillRect(0,0,256,512);
 for(let y=0;y<512;y+=24)for(let x=0;x<256;x+=20){
  const v=rand();g.fillStyle=v>.83?"#af9b75":v>.65?"#64747d":"#34414a";
  g.fillRect(x+2,y+3,16,15);g.fillStyle="#222e38";g.fillRect(x+10,y+3,1,15);
  if(v>.81){g.fillStyle="#665e51";g.fillRect(x+2,y+3,16,4);}
 }
 t.update();const m=new B.StandardMaterial("glazed tower",scene);m.diffuseTexture=t;m.emissiveTexture=t;
 m.diffuseColor=C(.24,.29,.34);m.emissiveColor=C(.48,.48,.5);m.specularColor=C(.04,.06,.08);return m;
});
const signMaterials=["ПОРТ  /  08","КИНО   21:30","НОЧНОЙ РЕЙС"].map((label,i)=>{
 const t=new B.DynamicTexture("illuminated lettering",{width:512,height:128},scene,true),g=t.getContext();
 const gradient=g.createLinearGradient(0,0,510,100);gradient.addColorStop(0,["#123343","#333447","#502b29"][i]);gradient.addColorStop(1,["#478b96","#9a586a","#b07b37"][i]);
 g.fillStyle=gradient;g.fillRect(0,0,512,128);g.fillStyle="#e8e1cc";g.font="bold 44px sans-serif";g.fillText(label,26,82);t.update();
 const m=new B.StandardMaterial("sign face",scene);m.diffuseTexture=t;m.emissiveTexture=t;m.disableLighting=true;m.emissiveColor=C(.85,.82,.72);return m;
});
const canopy=mat("dark metal canopy",C(.12,.14,.17),.22),warmStrip=mat("window light",C(.85,.53,.25),0,.65);
const reflected=[];
for(let i=0;i<18;i++){
 const root=new B.TransformNode("city block "+i,scene);root.position.z=i*14-15;
 for(const side of [-1,1]){
  if((i+(side<0?0:4))%9===4)continue;
  const index=side<0?[0,0,1,0,2,0][i%6]:[2,0,2,1,0,2][i%6];
  const height=[9,10,7.4][index],depth=13.4,front=7.82+.28*(i%3);
  const building=box("ground floor",7,height,depth,side*(front+3.5),height/2,0,facadeMaterials[index],root);
  facadeUV(building,7,height,depth);reflected.push(building);
  const tall=12+((i*13+(side+1)*3)%31);
  const tower=box("setback tower",9,tall,12.1,side*(front+5.2),height+tall*.5,0,officeMaterials[(i+index)%3],root);
  facadeUV(tower,9,tall,12.1);reflected.push(tower);
  if(i%3!==2){
    box("canopy",1.5,.19,9.1,side*(front-.57),2.85,0,canopy,root);
    box("canopy lighting",.06,.06,7.7,side*(front-1.22),2.72,0,warmStrip,root);
    for(const z of [-4.2,4.2])box("shop column",.14,2.75,.16,side*(front-1.08),1.37,z,streetPole,root);
  }
  if((i+side)%3===0){
    const board=box("marquee",.23,1.75,7.8,side*(front-.29),4.1,.35,signMaterials[i%3],root);
    facadeUV(board,.23,1.75,7.8);reflected.push(board);
  }

 }
 buildings.push(root);
}
function shell(name,rings,m,root){let pos=[],idx=[];for(let r of rings){let [z,w,b,t]=r;pos.push(-w,b,z,-w,t-.12,z,-w*.72,t,z,w*.72,t,z,w,t-.12,z,w,b,z)}for(let i=0;i<rings.length-1;i++)for(let j=0;j<6;j++){let a=i*6+j,b=i*6+(j+1)%6,c=a+6,d=b+6;idx.push(a,b,c,b,d,c)}idx.push(0,2,1,0,3,2,0,4,3,0,5,4);let e=(rings.length-1)*6;idx.push(e,e+1,e+2,e,e+2,e+3,e,e+3,e+4,e,e+4,e+5);let norms=[];B.VertexData.ComputeNormals(pos,idx,norms);let mesh=new B.Mesh(name,scene),vd=new B.VertexData();vd.positions=pos;vd.indices=idx;vd.normals=norms;vd.applyToMesh(mesh);mesh.material=m;mesh.parent=root;return mesh}
function car(n,m){const root=new B.TransformNode(n,scene);shell("sculpted body",[[-2,.76,.31,.70],[-1.8,.99,.30,.88],[-1.2,1.02,.30,.91],[0,.94,.31,.86],[1.1,.98,.31,.83],[1.85,.84,.32,.68],[2,.72,.36,.62]],m,root);shell("sloped cabin",[[-1.22,.73,.83,.91],[-.55,.71,.85,1.30],[-.1,.68,.85,1.42],[.55,.65,.85,1.35],[1.08,.74,.81,.86]],glass,root);shell("roof",[[-.6,.60,1.29,1.34],[-.12,.61,1.37,1.45],[.48,.57,1.29,1.35]],m,root);box("bumper",1.78,.22,.24,0,.38,-1.86,black,root);box("plate",.39,.15,.025,0,.58,-1.985,white,root);for(let s of [-1,1]){box("tail",.48,.075,.045,s*.59,.76,-1.98,red,root);box("tail outer",.09,.20,.045,s*.82,.70,-1.95,red,root);box("head",.58,.13,.04,s*.58,.78,1.86,white,root);box("exhaust",.2,.12,.1,s*.58,.29,-1.94,metal,root);for(let z of [-1.13,1.13]){let wheel=B.MeshBuilder.CreateCylinder("wheel",{height:.29,diameter:.7,tessellation:18},scene);wheel.rotation.z=Math.PI/2;wheel.position=V(s*.88,.36,z);wheel.material=tire;wheel.parent=root;let hub=B.MeshBuilder.CreateCylinder("hub",{height:.03,diameter:.39,tessellation:12},scene);hub.rotation.z=Math.PI/2;hub.position=V(s*1.04,.36,z);hub.material=metal;hub.parent=root}}return root}
const player=car("player",paint),originalMeshes=player.getChildMeshes().slice();let imported=null;const spoiler=box("wing",1.95,.075,.35,0,1.13,-1.52,black,player);const supports=[-1,1].map(s=>box("wing support",.08,.26,.1,s*.65,1,-1.52,black,player));const shadowMat=mat("contact shadow",C(.005,.008,.012));shadowMat.alpha=.44;const shade=new B.DynamicTexture("contact falloff",128,scene,false),sg=shade.getContext(),rad=sg.createRadialGradient(64,64,15,64,64,64);rad.addColorStop(0,"#000");rad.addColorStop(1,"transparent");sg.fillStyle=rad;sg.fillRect(0,0,128,128);shade.update();shade.hasAlpha=true;shadowMat.diffuseTexture=shade;shadowMat.useAlphaFromDiffuseTexture=true;let shadow=B.MeshBuilder.CreateDisc("contact shadow",{radius:1,tessellation:32},scene);shadow.rotation.x=Math.PI/2;shadow.scaling=V(1.15,2.15,1);shadow.position=V(0,.022,0);shadow.material=shadowMat;shadow.parent=player;let flame=box("flame",.85,.1,1.1,0,.27,-2.45,blue,player);flame.setEnabled(false);function appearance(){let isGold=$("paint").value==="gold"&&hasGold;for(let q of player.getChildMeshes())if(q.material===paint||q.material===gold)q.material=isGold?gold:paint;spoiler.setEnabled(isGold);supports.forEach(q=>q.setEnabled(isGold))}$("paint").onchange=appearance;appearance();
let mode="idle",lane=0,speed=0,distance=0,level=1,hp=3,energy=100,boost=0,hit=0,spawn=.5,traffic=[],age=0,noticeUntil=0,lastScore=0,record=Number(storage("tarVisualRecord"))||0;const trafficM=[mat("trafficRed",C(.55,.05,.1),.55),mat("trafficWhite",C(.63,.7,.79),.5),mat("trafficGrey",C(.15,.18,.22),.5)];function clearTraffic(){for(let o of traffic)o.root.dispose(false,false);traffic=[]}function move(d){if(mode==="run")lane=Math.max(-1,Math.min(1,lane+d))}function nitro(){if(mode==="run"&&energy>=25&&boost<=0){energy-=25;boost=2.4}}$("left").onclick=()=>move(-1);$("right").onclick=()=>move(1);$("nitro").onclick=nitro;addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight"," "].includes(e.key)&&!["SELECT","BUTTON"].includes(document.activeElement.tagName)){e.preventDefault();if(!e.repeat){if(e.key==="ArrowLeft")move(-1);else if(e.key==="ArrowRight")move(1);else nitro()}}});
function start(){if(mode==="run"||mode==="count")return;clearTraffic();distance=0;level=1;hp=3;energy=100;boost=hit=age=0;spawn=.6;lane=0;player.position.x=0;mode="count";$("share").hidden=true;$("paintLabel").hidden=true;$("qualityLabel").hidden=true;$("start").hidden=true;$("giftNote").hidden=true;$("desc").textContent="Приготовься";let n=3;$("title").textContent=n;let timer=setInterval(()=>{if(--n>0)$("title").textContent=n;else{clearInterval(timer);mode="run";speed=98;$("panel").hidden=true}},1000)}$("start").onclick=start;$("start").disabled=true;$("paintLabel").hidden=false;$("desc").textContent="Выбери оформление. Выживай, объезжай трафик и проходи чекпойнты.";function finish(){mode="end";flame.setEnabled(false);lastScore=Math.floor(distance);if(lastScore>record){record=lastScore;storage("tarVisualRecord",record)}$("title").textContent="ГОНКА ОКОНЧЕНА";$("desc").textContent=lastScore+" м • Уровень "+level+" • Рекорд "+record+" м";$("start").textContent="Ещё раз";$("start").hidden=false;$("share").hidden=false; $("paintLabel").hidden=!!imported;$("qualityLabel").hidden=false;$("panel").hidden=false;$("notice").hidden=true}$("share").onclick=async()=>{let text="Мой результат TAR PLAY 3D: "+lastScore+" м. https://andtar86-ai.github.io/tar-play/quay/";try{if(navigator.share)await navigator.share({text});else{await navigator.clipboard.writeText(text);alert("Скопировано")}}catch(e){if(e.name!=="AbortError")prompt("Скопируй результат",text)}};
let hudTimer=0;mirror.renderList=reflected;
mirror.refreshRate=2;
const passingLamp=new B.PointLight("passing street lamp",V(-5,4,0),scene);
passingLamp.diffuse=C(1,.73,.43);
passingLamp.range=17;
passingLamp.intensity=3.2;
const shopLight=new B.PointLight("passing illuminated windows",V(4.8,2,0),scene);shopLight.range=10;shopLight.intensity=1.8;shopLight.diffuse=C(.42,.71,.95);
bendStreet(0);
const assetRoot="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/";B.SceneLoader.ImportMeshAsync("",assetRoot,"CarConcept.glb",scene).then(result=>{for(const a of result.animationGroups){a.reset();a.stop()}let root=new B.TransformNode("importedCar",scene);for(let mesh of result.meshes){if(!mesh.parent)mesh.parent=root}const lampCenter=name=>{
 const meshes=result.meshes.filter(m=>m.material?.name===name);
 if(!meshes.length)return null;
 return meshes.reduce((v,m)=>{m.computeWorldMatrix(true);return v.add(m.getBoundingInfo().boundingBox.centerWorld)},V(0,0,0)).scale(1/meshes.length);
};
const nose=lampCenter("Headlight"),tail=lampCenter("Brakelight");root.rotation.y=nose&&tail?-Math.atan2(nose.x-tail.x,nose.z-tail.z):0;root.computeWorldMatrix(true);let bounds=root.getHierarchyBoundingVectors(true),size=bounds.max.subtract(bounds.min),factor=4.15/Math.max(size.x,size.z);if(!Number.isFinite(factor)||factor<=0)throw Error("invalid asset bounds");root.scaling.setAll(factor);root.computeWorldMatrix(true);bounds=root.getHierarchyBoundingVectors(true);root.position=V(-(bounds.min.x+bounds.max.x)/2,-bounds.min.y,-(bounds.min.z+bounds.max.z)/2);root.parent=player;imported=root;
for(const mesh of result.meshes){
 if(/Headrest|Seat_Back/.test(mesh.name))mesh.setEnabled(false);
 const material=mesh.material;
 if(material?.name==="Paint 1 Carmine")material.albedoColor=C(.35,.30,.27);
 if(material?.name==="Smoked Smart Glass"){material.alpha=1;material.transparencyMode=0;material.backFaceCulling=false;}
}for(let mesh of originalMeshes)mesh.setEnabled(false);spoiler.setEnabled(false);supports.forEach(q=>q.setEnabled(false));$("assetStatus").textContent="Car Concept · Eric Chadwick / Darmstadt Graphics Group · CC BY 4.0";$("paintLabel").hidden=true;$("paint").disabled=true;$("start").disabled=false}).catch(e=>{console.error(e);$("assetStatus").textContent="Готова базовая машина";$("start").disabled=false});engine.runRenderLoop(()=>{let dt=Math.min(.08,engine.getDeltaTime()/1000);if(mode==="run"){age+=dt;boost=Math.max(0,boost-dt);hit=Math.max(0,hit-dt);energy=Math.min(100,energy+dt*4);let base=Math.min(215,130+age*3+(level-1)*5),target=hit>0?90:base+(boost>0?75:0);speed+=(target-speed)*Math.min(1,dt*3);let dz=speed/3.6*dt;distance+=dz;let next=1+Math.floor(distance/500);if(next>level){level=next;noticeUntil=age+2;$("notice").textContent="CHECKPOINT • "+level}$("notice").hidden=age>=noticeUntil;player.position.x+=(lane*3.45-player.position.x)*Math.min(1,dt*12);player.rotation.z=(lane*3.45-player.position.x)*-.055;for(let r of road){r.position.z-=dz;if(r.position.z< -20)r.position.z+=256}for(let r of buildings){r.position.z-=dz;if(r.position.z< -25)r.position.z+=252}spawn-=dt;if(spawn<=0){spawn=Math.max(.6,1.35-(level-1)*.07)+Math.random()*.35;let root=car("traffic",trafficM[Math.floor(Math.random()*3)]);root.position=V((Math.floor(Math.random()*3)-1)*3.45,0,115);traffic.push({root,lateral:root.position.x,passed:false})}for(let o of traffic){let prev=o.root.position.z;o.root.position.z-=dz*.7;o.root.position.x=o.lateral+offsetAt(distance,o.root.position.z);o.root.rotation.y=Math.atan(tangent(distance+o.root.position.z)-tangent(distance));if(!o.passed&&prev>3.1&&o.root.position.z<=3.1){o.passed=true;if(Math.abs(o.root.position.x-player.position.x)<1.8&&hit<=0){hp--;hit=1.2;boost=0;speed=60}}}traffic=traffic.filter(o=>{if(o.root.position.z< -15){o.root.dispose(false,false);return false}return true});flame.setEnabled(boost>0);bendStreet(distance);
passingLamp.position.z=18-(distance%32);shopLight.position.z=15-((distance+8)%29);
camera.fov+=((boost>0?.96:.83)-camera.fov)*(1-Math.exp(-3*dt));
camera.position.y=2.45;camera.position.z=-6.55;
camera.position.x+=(player.position.x*.72-camera.position.x)*(1-Math.exp(-5*dt));
camera.setTarget(V(camera.position.x*.74+offsetAt(distance,22)*.75,.65,13));
if(hp<=0)finish()}else if(mode==="idle"||mode==="end"){camera.position=V(Math.sin(performance.now()*.00055)*3,3.3,-7.5);camera.setTarget(V(0,.65,0))}if(mode==="count"){camera.position=V(0,4.2,-8.8);camera.setTarget(V(0,1.2,15))}$("speed").textContent=Math.round(speed);$("dist").textContent=Math.floor(distance)+" м";$("level").textContent=level;$("charge").style.width=energy+"%";$("status").textContent="Жизни: "+("♥ ".repeat(hp))+" • Нитро: "+Math.floor(energy)+"%";$("nitro").disabled=mode!=="run"||energy<25||boost>0;scene.render();hudTimer+=dt;if(hudTimer>.5){hudTimer=0;$("fps").textContent=Math.round(engine.getFps())+" FPS"}});addEventListener("resize",()=>engine.resize());}
