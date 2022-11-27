
const dataArray = [5, 11, 18];

const input = [
    {base: "G"},
    {base: "U"},
    {base: "U"},
    {base: "G"},
    {base: "C"},
    {base: "G"},
    {base: "G"},
    {base: "C"},
    {base: "A"},
    {base: "C"},
    {base: "C"},
    {base: "U"},
    {base: "A"},
]

const snippets = [
    // type 1, 3 are "inclusion", type 2 is "skipping"
    {name: 'GUU', type:'1', start: 0, end: 3, strength: 13, skipping: 0},
    {name: 'GCG', type:'2', start: 3, end: 6, strength: 24, skipping: 1},
    {name: 'GGCA', type:'3', start: 5, end: 9, strength: 37, skipping: 0},
    {name: 'CACC', type:'1', start: 9, end: 13, strength: 13, skipping: 0},
]

const skipping = ['2'];
const inclusion = ['1', '3'];

console.log(skipping.includes('2'));


const canva = d3.select('.canva');
const diagram = canva.select('#diagram');
const chain = canva.select('#chain');

function drawChain(){
    console.log('drawChain');
}


const chainRect = chain.selectAll('chain-rect');


chainRect.data(input)
    .enter()
    .append('text')
    .attr('class', 'chain-text')
    .attr('x', (d, i) => {
        return i * 20;
    })
    .attr('y', (d, i) => {
        return 63;
    })
    .text((d) => {
        return d.base;
    });

chainRect.data(snippets)
    .enter()
    .append('rect')
    .attr('id', (d, i) => {
        return d.type;
    })
    .attr('class', function(d) {
        if(d.skipping == 0){
            return 'chain-snippet-inclusion';
        } else if(skipping.includes(d.type)){
            return 'chain-snippet-skipping';
        }
    })
    .attr('width', (d) => {
        return (d.end - d.start)*18;
        })
    .attr('height', 18)
    .attr('x', (d) => {
        return d.start * 20;
    })
    .attr('y', (d) => {
        return 50;
    });


let snippet = [];
let type = [];
snippets.forEach((d, i) => {
    if(!type.includes(d.type)){
        type.push(d.type);
        snippet.push({type: d.type, strength: d.strength, skipping: d.skipping});
    }
});
console.log(snippet);


let skippingHeight = 0;
let inclusionHeight = 0;
let drawn =[];

const rect = diagram.selectAll('d-rect');

rect.data(snippet)
    .enter()
    .append('rect')
    .attr('class', 'd-rect')
    .attr('id', (d)=>d.type)
    .attr('fill', (d)=>
    {
        if(d.skipping == 0){
            return "#132482";
        } else if(d.skipping==1){
            return '#c1575c';
        }
    })
    .attr('stroke', "white")
    .attr('width', 30)
    .attr('height', (d) => {
        return d.strength;
    })
    .attr('x', (d, i) => {
        return d.skipping*30;
    })
    .attr('y', (d, i) => {
        if(d.skipping == 0){
            inclusionHeight += d.strength;
            return 100 - inclusionHeight;
        } else if(d.skipping == 1){
            skippingHeight += d.strength;
            console.log(skippingHeight);
            return 100 - skippingHeight;
        }
    });


const text = diagram.selectAll('d-text');
let skippingTextY = 0;
let inclusionTextY = 0;

text.data(snippet)
    .enter()
    .append('text')
    .attr('class', 'd-text')
    .attr('x', (d, i) => {
        return d.skipping*30 + 12;
    })
    .attr('y', (d, i) => {
        if(d.skipping == 0){
            inclusionTextY += d.strength;
            return 100 - inclusionTextY + 10;
        } else if(d.skipping == 1){
            skippingTextY += d.strength;
            return 100 - skippingTextY + 10;
        }
    })
    .attr('fill', 'white')
    .text((d) => {
        return d.type;
    });

document.getElementById('diagram').
    querySelectorAll('.d-rect, .d-text').
    forEach(function(d){
        d.addEventListener('mouseover', function(){
            console.log(d.id);
            const current = d.id;
            const blocks = document.getElementById('chain').querySelectorAll('rect');
            blocks.forEach(function(b){
                if(b.id == current && b.id != '2'){
                    b.classList.add('chain-snippet-inclusion-hover');
                }else if(b.id == current && b.id == '2'){
                    b.classList.add('chain-snippet-skipping-hover');
                }
            })
        });
    });

    document.getElementById('diagram').
    querySelectorAll('.d-rect, .d-text').
    forEach(function(d){
        d.addEventListener('mouseout', function(){
            console.log(d.id);
            const current = d.id;
            const blocks = document.getElementById('chain').querySelectorAll('rect');
            blocks.forEach(function(b){
                if(b.id == current && b.id != '2'){
                    b.classList.remove('chain-snippet-inclusion-hover');
                }else if(b.id == current && b.id == '2'){
                    b.classList.remove('chain-snippet-skipping-hover');
                }
            })
        });
    });


d3.json('data/data.json').then(data => {
    console.log(data);
});
