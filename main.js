
//When the button is clicked constinue with fetch function
document.querySelector("button").addEventListener("click",getFetch)
function getFetch(){
    //Store the users input into choic varaible
    //Convert the user input to remove any spaces and replace them with dashes, remove any . and replace with empty character, convert string to lowercase
    const choice = document.querySelector("input").value.replaceAll(' ','-').replaceAll('.','').toLowerCase()
    //Save the user input to be used later when calling the api
    const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        //CALL THE CLASS POKEINFO, passing required arguments
        const potentialPet = new PokeInfo(data.name,data.height,data.weight,data.types,data.sprites.other["official-artwork"].front_default,data.location_area_encounters)
        //CALL the types 
        potentialPet.getTypes()
        //CALL if it is a good house pet
        potentialPet.isItHousePet()
        //CREATE an empty string where it will later store the decision to the dom
        let decision = ""
        //CLEARS the dom
        document.getElementById("location").innerText = ""
        //CONDITIONALS
        if (potentialPet.housePet){
            decision = `This pokemon is small enough, light enough, and safe enough to be a good house pet! You can find ${potentialPet.name} in the following location(s):`
            // document.getElementById("location").innerText = ""
            potentialPet.encounterInfo()
            
        }else{
            // document.getElementById("location").innerText = ""
            decision = `This pokemon would not be a good house pet because ${potentialPet.reason.join(" and ")}.`
         
        }
        //ADDS the decision and image to the dom
        document.querySelector("h2").innerText = decision
        document.querySelector("img").src = potentialPet.image
    })
    .catch(err=>{
        console.log(`error ${err}`)
    })
}
//runs when it is called through the api
class Poke{
    constructor(name,height,weight,types,image){
        this.name = name
        this.height = height
        this.weight = weight
        this.types=types
        this.image = image
        //set as defualt 
        this.housePet = true
        this.reason = []
        this.typeList=[]
    }
    //LOOPS through the object of the api to get the type name so it can be used for decision making, it pushes it to the declared type List array. 
    getTypes(){
        for(const item of this.types){
            this.typeList.push(item.type.name)
        }
        console.log(this.typeList)
    }
    //CALCULATES the weight 
    weightToPounds(weight){
        return Math.round((weight/4.536)*100)/100
    }
    //CALCULATES  the height
    heightToFeet(height){
        return Math.round((height/3.048)*100)/100
    }
    //DETERMINES IF IT IS A GOOD HOUSE PET
    isItHousePet(){
        //SETS an array of bad types to compare with the user inputs types 
        let badTypes = ["fire","electric","fighting","poison","ghost","psychic"]
        //IF loops to check each conditional, if they are all true then it is a good house pet
        //checks weight less that 400 by passing the weight function
        if(this.weightToPounds(this.weight)>400){
            this.reason.push(`it is too heavy at ${this.weightToPounds(this.weight)} pounds`)
            this.housePet = false
        }
        if(this.heightToFeet(this.height)>7){
            //checks height less than 7feetby passing the height function
            this.reason(`It is too tall at ${this.heightToFeet(this.height)} feet`)
            this.housePet = false
        }
        if(badTypes.some(r=>this.typeList.indexOf(r)>=0)){
            //compares the badlist to the typelist, tests wheather at least one element in the array passes the conditional;true, if not it is false
            this.reason.push("Its type is too dangerous!")
            this.housePet = false
        }
    }
}
//CHILD class to the Poke class
//TO get the locations where the pet can be found, the api has a nested api with locations. Intead of calling another fetch inside the first fetch, create code here for simplicity and readability.
class PokeInfo extends Poke{
    //SAME parameters passed as the parent class
    constructor(name,height,weight,types,image,location){
        //SUPER get the information from what was passed in the parent class
        super(name,height,weight,types,image)
        this.locationUrl = location
        this.locationList = []
      
    }
    //METHOD THAT CALLS API
    encounterInfo(){
        //GETS  the locationURL when the argument is passed in the first fetch 
        fetch(this.locationUrl)
        .then(res => res.json())
        .then(data =>{
            console.log(data)
            //LOOPS through the object to get the location names and stores it as an array
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
    //METHOD that makes the location name more readable before it is printed to the dom
    locationCleanUp(){
        //Only gives the first five locations, joins them with a comma, and replaces all - with a space and then puts words in an array
        const words = this.locationList.slice(0,5).join(", ").replaceAll("-"," ").split(" ")
        //loops through the array 
        for(let i = 0; i<words.length;i++){
            //takes the word and changes it to make the first word uppercase and then copyies the following characters 
            words[i]= words[i][0].toUpperCase()+words[i].slice(1)
        }
        //turns array back to string seperated by a space
        return words.join(" ")
    }
}
