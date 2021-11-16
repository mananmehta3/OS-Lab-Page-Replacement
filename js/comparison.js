class fifo{
    constructor(capacity_fifo){
        this.capacity_fifo=capacity_fifo;
        this.pageFaults_fifo=0;
        this.pageHits_fifo=0;
        this.searchIndex_fifo=-1; 
        this.frames_fifo=[];
    }
    refer(token_fifo) {
        this.searchIndex_fifo=this.frames_fifo.indexOf(token_fifo);
        if(this.searchIndex_fifo==-1){
            this.pageFaults_fifo++;
            this.frames_fifo.push(token_fifo)
            if(this.frames_fifo.length>this.capacity_fifo){
                this.frames_fifo.shift()
            }
        }
        else 
            this.pageHits_fifo++;
    }
}

class lifo{
    constructor(capacity_lifo){
        this.capacity_lifo=capacity_lifo;
        this.pageFaults_lifo=0;
        this.pageHits_lifo=0;
        this.searchIndex_lifo=-1;
        this.frames_lifo=[];   
    }
    refer(token_lifo){
        this.searchIndex_lifo=this.frames_lifo.indexOf(token_lifo);
        if(this.searchIndex_lifo!=-1){
            this.pageHits_lifo++;
        }
        else{
            this.pageFaults_lifo++;
            if(this.capacity_lifo==this.frames_lifo.length){
                this.frames_lifo.pop();
            }
            this.frames_lifo.push(token_lifo);
        }
    }
}

class node {
    constructor(data) {
        this.data = data;
        this.l = null;
        this.r = null;
    }
}
class Dequeue {
    constructor() {
        this.left = null;
        this.right = null;
        this.size=0;
    }
    addFront(x) {
        let newNode = new node(x);
        newNode.r =this.left;
        if(this.left!=null)
            this.left.l = newNode;
        else{
            this.right=newNode;
        }
        this.left=newNode;
        this.size++;
    }

    deleteLast(){
        let tmp=this.right;
        this.right=tmp.l;
        this.right.r=null;
        this.size--;
    }
    delete(x) {
        if(x==null) return;
        //first element
        if(x==this.left && x==this.right){
            this.left=null;
            this.right=null;
            this.size--;
            return;
        }
        if(x==this.left){
            this.left=x.r;
            x.r.l=null;
            this.size--;
            return;
        }
        if(x==this.right){
            this.right=x.l;
            this.right.r=null;
            this.size--;
            return;
        }
        x.l.r=x.r;
        x.r.l=x.l;
        this.size--;
    }
    display(){
        let fr=[];
        let temp=this.left;
        while(temp!=null){
            fr.push(temp.data);
            temp=temp.r;
        }
        return fr;
    }
}
class lru{
    constructor(capacity_lru){
        this.capacity_lru=capacity_lru;
        this.pageFaults_lru=0;
        this.pageHits_lru=0;
        this.searchIndex_lru=-1; 
        this.map_lru = new Map();
        this.dequeue_lru = new Dequeue();   
    }
    refer(token) {
        if(this.map_lru.has(token)){
            this.pageHits_lru++;
            this.searchIndex_lru=0;
            this.dequeue_lru.delete(this.map_lru.get(token));
            this.map_lru.delete(token);
        }
        else{ 
            this.pageFaults_lru++;
            this.searchIndex_lru=-1;
            if(this.capacity_lru==this.dequeue_lru.size){
                this.dequeue_lru.deleteLast();
                this.map_lru.delete(this.frames_lru[this.frames_lru.length-1]);
            }
        }
        this.dequeue_lru.addFront(token);
        this.map_lru.set(token,this.dequeue_lru.left);
        this.frames_lru =this.dequeue_lru.display();   
    }
}

class optimal{
    constructor(capacity_optimal){
        this.capacity_optimal=capacity_optimal;
        this.pageFaults_optimal=0;
        this.pageHits_optimal=0;
        this.searchIndex_optimal=-1;
        this.frames_optimal=[];
        this.sr_optimal=[]   
    }
    refer(token_optimal,remaining_optimal){
        this.searchIndex_optimal=this.frames_optimal.indexOf(token_optimal);
        if(this.searchIndex_optimal!=-1){
            this.pageHits_optimal++;
        }
        else{
            this.pageFaults_optimal++;
            if(this.capacity_optimal==this.frames_optimal.length){
                let t=this.sr_optimal.indexOf(-1);
                if(t==-1){
                    t=this.sr_optimal.indexOf(Math.max(...this.sr_optimal));
                }
                this.frames_optimal[t]=token_optimal;
                if(remaining_optimal.indexOf(token_optimal)==-1)this.sr_optimal[t]=-1;
                else this.sr_optimal[t]=this.frames_optimal.length+1+remaining_optimal.indexOf(token_optimal);
            }
            else{
                if(remaining_optimal.indexOf(token_optimal)==-1)this.sr_optimal.push(-1);
                else this.sr_optimal.push(this.frames_optimal.length+1+remaining_optimal.indexOf(token_optimal));
                this.frames_optimal.push(token_optimal);
            }
        }
    }
}

 
let  Miss_ratio_fifo, Hit_ratio_fifo, page_fault_fifo; 
let  Miss_ratio_lifo, Hit_ratio_lifo, page_fault_lifo;
let  Miss_ratio_lru, Hit_ratio_lru, page_fault_lru;
let  Miss_ratio_optimal, Hit_ratio_optimal, page_fault_optimal;


document.getElementById("compare").addEventListener("click", FIFO);
document.getElementById("compare").addEventListener("click",LIFO);
document.getElementById("compare").addEventListener("click",LRU);
document.getElementById("compare").addEventListener("click",OPTIMAL);
document.getElementById("compare").addEventListener("click",graph);
document.getElementById("compare").addEventListener("click",graph1);
document.getElementById("compare").addEventListener("click",graph2);

function FIFO(){
    title_fifo('tfifo');
    let res_fifo = document.getElementById("input").value.split(" ");
    let frames_fifo = document.getElementById("frames").value;
    let ref_fifo=[];
    for (let i = 0; i < res_fifo.length; i++) {
        if (res_fifo[i] != " " && res_fifo[i] != "") {
            ref_fifo.push(res_fifo[i]);
        }
    }

    createTable("table_fifo",frames_fifo,ref_fifo);
    let obj_fifo = new fifo(frames_fifo);
    for(let i=0;i<ref_fifo.length;i++){
        obj_fifo.refer(ref_fifo[i]);
        fillcol("table_fifo",i+1,obj_fifo.frames_fifo,frames_fifo,obj_fifo.searchIndex_fifo);
    }
    summary('summary_fifo',obj_fifo.pageFaults_fifo,obj_fifo.pageFaults_fifo+obj_fifo.pageHits_fifo,frames_fifo);

    Miss_ratio_fifo = (obj_fifo.pageFaults_fifo/(obj_fifo.pageFaults_fifo+obj_fifo.pageHits_fifo));
    Hit_ratio_fifo = (1-Miss_ratio_fifo);
    page_fault_fifo = obj_fifo.pageFaults_fifo; 
}

function LIFO(){
    title_Lifo('tlifo');
    let res_lifo = document.getElementById("input").value.split(" ");
    let frames_lifo = document.getElementById("frames").value;
    let ref_lifo=[];
    for (let i = 0; i < res_lifo.length; i++) {
        if (res_lifo[i] != " " && res_lifo[i] != "") {
            ref_lifo.push(res_lifo[i]);
        }
    }
    createTable("table_lifo",frames_lifo,ref_lifo);
    let obj_lifo = new lifo(frames_lifo);
    for(let i=0;i<ref_lifo.length;i++){
        obj_lifo.refer(ref_lifo[i]);
        fillcol("table_lifo",i+1,obj_lifo.frames_lifo,frames_lifo,obj_lifo.searchIndex_lifo);
    }
    summary('summary_lifo',obj_lifo.pageFaults_lifo,obj_lifo.pageFaults_lifo+obj_lifo.pageHits_lifo,frames_lifo);

    Miss_ratio_lifo = (obj_lifo.pageFaults_lifo/(obj_lifo.pageFaults_lifo+obj_lifo.pageHits_lifo));
    Hit_ratio_lifo = (1-Miss_ratio_lifo);
    page_fault_lifo = obj_lifo.pageFaults_lifo;
    
}

function LRU(){
    title_Lru('tlru');
     res_lru = document.getElementById("input").value.split(" ");
     frames_lru = document.getElementById("frames").value;
     ref_lru=[];
    for (let i = 0; i < res_lru.length; i++) {
        if (res_lru[i] != " " && res_lru[i] != "") {
            ref_lru.push(res_lru[i]);
        }
    }
    createTable("table_lru",frames_lru,ref_lru);
     obj_lru = new lru(frames_lru);
    for(let i=0;i<ref_lru.length;i++){
        obj_lru.refer(ref_lru[i]);
        fillcol("table_lru",i+1,obj_lru.frames_lru,frames_lru,obj_lru.searchIndex_lru);
    }
    summary('summary_lru',obj_lru.pageFaults_lru,obj_lru.pageFaults_lru+obj_lru.pageHits_lru,frames_lru);

    Miss_ratio_lru = (obj_lru.pageFaults_lru/(obj_lru.pageFaults_lru+obj_lru.pageHits_lru));
    Hit_ratio_lru = (1-Miss_ratio_lru);
   page_fault_lru = obj_lru.pageFaults_lru;
}

function OPTIMAL(){
    title_Optimal('toptimal');
    let res_optimal = document.getElementById("input").value.split(" ");
    let frames_optimal = document.getElementById("frames").value;
    let ref_optimal=[];
    for (let i = 0; i < res_optimal.length; i++) {
        if (res_optimal[i] != " " && res_optimal[i] != "") {
            ref_optimal.push(res_optimal[i]);
        }
    }
    createTable("table_optimal",frames_optimal,ref_optimal);
    let obj_optimal = new optimal(frames_optimal);
    for(let i=0;i<ref_optimal.length;i++){
        obj_optimal.refer(ref_optimal[i],ref_optimal.slice(i+1));
        fillcol("table_optimal",i+1,obj_optimal.frames_optimal,frames_optimal,obj_optimal.searchIndex_optimal);
    }
    summary('summary_optimal',obj_optimal.pageFaults_optimal,obj_optimal.pageFaults_optimal+obj_optimal.pageHits_optimal,frames_optimal);

    Miss_ratio_optimal = (obj_optimal.pageFaults_optimal/(obj_optimal.pageFaults_optimal+obj_optimal.pageHits_optimal));
    Hit_ratio_optimal = (1-Miss_ratio_optimal);
   page_fault_optimal = obj_optimal.pageFaults_optimal;
}


function title_fifo(id){
    let title1='';
    title1+=`<div>FIFO:-</div>`;
    document.getElementById(id).innerHTML=title1; 
}

function title_Lifo(id){
    let title2='';
    title2+=`<div>LIFO:-</div>`;
    document.getElementById(id).innerHTML=title2; 
}

function title_Lru(id){
    let title3='';
    title3+=`<div>LRU:-</div>`;
    document.getElementById(id).innerHTML=title3; 
}

function title_Optimal(id){
    let title4='';
    title4+=`<div>Optimal:-</div>`;
    document.getElementById(id).innerHTML=title4; 
}

function fillcol(tablename,col,objframes_fifo,n,searchindex_fifo){
    for(let i=1;i<=objframes_fifo.length;i++){
        let cell=document.getElementById(tablename+i+''+col);
        cell.innerHTML=objframes_fifo[i-1];
    }
    n++;
    let cell=document.getElementById(tablename+n+''+col);
    if(searchindex_fifo==-1)cell.innerHTML="MISS";
    else{
        console.log(tablename+n+''+col); 
        cell.innerHTML="HIT";
        document.getElementById(tablename+(searchindex_fifo+1)+''+col).classList.add("bg-success","text-white");
    }
}
function createTable(tablename,frames_fifo,ref_fifo){
    document.getElementById(tablename).innerHTML="";
    let table = '<tr><td id="'+tablename+'00" style="font-weight:bolder;">Reference</td>';
    for (let i = 0; i < ref_fifo.length; i++) {
        table += '<td style="font-weight:bolder;" id="'+tablename+'0'+(i+1) + '">' + ref_fifo[i] + "</td>";
    }
    table += "</tr>";
    for (let i = 0; i < frames_fifo; i++) {
        table += '<tr><td style="font-weight:bolder;"id="' +tablename+ (i + 1) + '0">Frame ' + (i + 1) + "</td>";
        for (let j = 0; j < ref_fifo.length; j++) {
            table += '<td id="'+tablename + (i + 1) + (j + 1) + '"></td>';
        }
        table += "</tr>";
    }
    frames_fifo++;
    table += '<tr><td style="font-weight:bolder;"id="' +tablename+ frames_fifo + '0">Status</td>';
    for (var j = 1; j <= ref_fifo.length; j++) {
        table += '<td id="' +tablename+ frames_fifo + j + '"></td>';
    }
    table += "</tr>";
    console.log(table);
    document.getElementById(tablename).innerHTML += table;
}

function summary(id,pagefaults_fifo,pages,frames_fifo){
    let summary ="";
    
    let missratio=(pagefaults_fifo / pages).toPrecision(2);
    let hitratio=(1-missratio).toPrecision(2);
    a=missratio;
    b=hitratio;
    summary+=`<div>Pages:${pages}</div>`;
    summary+=`<div>Frames:${frames_fifo}</div>`;
    summary+=`<div>Hits:${pages-pagefaults_fifo}</div>`;
    summary+=`<div>Faults:${pagefaults_fifo}</div>`; 
    summary+=`<div>Hit Ratio:${hitratio}</div>`; 
    summary+=`<div>Miss Ratio:${missratio}</div>`;
    document.getElementById(id).innerHTML=summary; 
}

function graph(){
    fault_graph('summary_Page_fault');
}

function graph1(){
    Miss_ratio_graph('summary_Miss_ratio');
}

function graph2(){
    Hit_ratio_graph('summary_Hit_ratio');
}

function fault_graph(id){
    let summary_fault='';
    summary_fault+=`<div>------------------------------Page Fault------------------------------</div>`; 
    summary_fault+=`<div>Page Faults of fifo: ${page_fault_fifo}</div>`; 
    summary_fault+=`<div>Page Faults of lifo::${page_fault_lifo}</div>`; 
    summary_fault+=`<div>Page Faults of lru::${page_fault_lru}</div>`; 
    summary_fault+=`<div>Page Faults of optimal::${page_fault_optimal}</div>`; 
    document.getElementById(id).innerHTML=summary_fault; 

    var chart = new CanvasJS.Chart("chartContainer",
    {
        animationEnabled: true,
      title:{
        text: "Page Fault Comaparision by graph"
      },
      axisY: {
        title: "No of Page Faults",
        minimum: 0
      },
      data: [
      {
        type: "bar",
        dataPoints: [
            
        { y: page_fault_fifo, label: "Fifo"},
        { y: page_fault_lifo, label: "Lifo"},
        { y: page_fault_lru, label: "Lru"},
        { y: page_fault_optimal, label: " Optimal"},
        ]
      },
     ]
    });

chart.render();

var chart = new CanvasJS.Chart("chartContainer_Miss_ratio",
{
    animationEnabled: true,
  title:{
    text: "Miss Ratio Comaparision by graph"
  },
  axisY: {
    title: "Miss Ratio",
    minimum: 0
    //aximum: 1
  },
  data: [
  {
    type: "bar",
    dataPoints: [
    { y: Miss_ratio_fifo, label: "Fifo"},
    { y: Miss_ratio_lifo, label: "Lifo"},
    { y: Miss_ratio_lru, label: "Lru"},
    { y: Miss_ratio_optimal, label: " Optimal"},
    ]
  },
 ]
});

chart.render();

}

function Miss_ratio_graph(id){
    let summary_Miss_ratio='';
    summary_Miss_ratio+=`<div>------------------------------Miss Ratio------------------------------</div>`; 
    summary_Miss_ratio+=`<div>Miss Ratio of fifo: ${(Miss_ratio_fifo).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Miss Ratio of lifo::${(Miss_ratio_lifo).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Miss Ratio of lru::${(Miss_ratio_lru).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Miss Ratio of optimal::${(Miss_ratio_optimal).toPrecision(2)}</div>`; 
    document.getElementById(id).innerHTML=summary_Miss_ratio; 

        var chart = new CanvasJS.Chart("chartContainer_Miss_ratio",
    {
        animationEnabled: true,
      title:{
        text: "Miss Ratio Comaparision by graph"
      },
      axisY: {
        title: "Miss Ratio",
        minimum: 0
      },
      data: [
      {
        type: "bar",
        dataPoints: [
        { y: Miss_ratio_fifo, label: "Fifo"},
        { y: Miss_ratio_lifo, label: "Lifo"},
        { y: Miss_ratio_lru, label: "Lru"},
        { y: Miss_ratio_optimal, label: " Optimal"},
        ]
      },
     ]
    });

chart.render();

}
     
 
function Hit_ratio_graph(id){
    let summary_Miss_ratio='';
    summary_Miss_ratio+=`<div>------------------------------Hit Ratio------------------------------</div>`; 
    summary_Miss_ratio+=`<div>Hit Ratio of fifo: ${(Hit_ratio_fifo).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Hit Ratio of lifo::${(Hit_ratio_lifo).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Hit Ratio of lru::${(Hit_ratio_lru).toPrecision(2)}</div>`; 
    summary_Miss_ratio+=`<div>Hit Ratio of optimal::${(Hit_ratio_optimal).toPrecision(2)}</div>`; 
    document.getElementById(id).innerHTML=summary_Miss_ratio; 

        var chart = new CanvasJS.Chart("chartContainer_Hit_ratio",
    {
        animationEnabled: true,
      title:{
        text: "Hit Ratio Comaparision by graph"
      },
      axisY: {
        title: "Hit Ratio",
        minimum: 0
      },
      data: [
      {
        type: "bar",
        dataPoints: [
        { y: Hit_ratio_fifo, label: "Fifo"},
        { y: Hit_ratio_lifo, label: "Lifo"},
        { y: Hit_ratio_lru, label: "Lru"},
        { y: Hit_ratio_optimal, label: " Optimal"},
        ]
      },
     ]
    });

chart.render();

}

 
