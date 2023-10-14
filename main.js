document.querySelector("button").addEventListener("click",getFetch)
function getFetch(){
    const choice = document.querySelector("input").value.replaceAll(' ','-').replaceAll('.','').toLowerCase()
    const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        const potentialPet = new PokeInfo(data.name,data.height,data.weight,data.types,data.sprites.other["official-artwork"].front_default,data.location_area_encounters)

        potentialPet.getTypes()
        potentialPet.isItHousePet()
        
        let decision = ""
        document.getElementById("location").innerText = ""
        if (potentialPet.housePet){
            decision = `This pokemon is small enough, light enough, and safe enough to be a good house pet! You can find ${potentialPet.name} in the following location(s):`
            // document.getElementById("location").innerText = ""
            potentialPet.encounterInfo()
            
        }else{
            // document.getElementById("location").innerText = ""
            decision = `This pokemon would not be a good house pet because ${potentialPet.reason.join(" and ")}.`
         
        }
        document.querySelector("h2").innerText = decision
        document.querySelector("img").src = potentialPet.image
    })
    .catch(err=>{
        console.log(`error ${err}`)
    })
}

class Poke{
    constructor(name,height,weight,types,image){
        this.name = name
        this.height = height
        this.weight = weight
        this.types=types
        this.image = image
        this.housePet = true
        this.reason = []
        this.typeList=[]
    }
    getTypes(){
        for(const item of this.types){
            this.typeList.push(item.type.name)
        }
        console.log(this.typeList)
    }
    weightToPounds(weight){
        return Math.round((weight/4.536)*100)/100
    }
    heightToFeet(height){
        return Math.round((height/3.048)*100)/100
    }
    isItHousePet(){
        let badTypes = ["fire","electric","fighting","poison","ghost,psychic"]
        if(this.weightToPounds(this.weight)>400){
            this.reason.push(`it is too heavy at ${this.weightToPounds(this.weight)} pounds`)
            this.housePet = false
        }
        if(this.heightToFeet(this.height)>7){
            this.reason(`It is too tall at ${this.heightToFeet(this.height)} feet`)
            this.housePet = false
        }
        if(badTypes.some(r=>this.typeList.indexOf(r)>=0)){
            this.reason.push("Its type is too dangerous!")
            this.housePet = false
        }//compares the badlist to the typelist, tests wheather at least one element in the array passes the conditional;true, if not it is false
    }
}

class PokeInfo extends Poke{
    constructor(name,height,weight,types,image,location){
        super(name,height,weight,types,image)
        this.locationUrl = location
        this.locationList = []
        this.locationString = ''
    }
    encounterInfo(){
        fetch(this.locationUrl)
        .then(res => res.json())
        .then(data =>{
            console.log(data)
            for(const item of data){
                this.locationList.push(item.location_area.name)
            }
            let target = document.getElementById("location")
            target.innerText = this.locationCleanUp()
        })
        .catch(err=>{
            console.log(`error ${err}`)
        })
    }
    locationCleanUp(){
        const words = this.locationList.slice(0,5).join(", ").replaceAll("-"," ").split(" ")
        for(let i = 0; i<words.length;i++){
            words[i]= words[i][0].toUpperCase()+words[i].slice(1)
        }
        return words.join(" ")
    }
}
