const shuffleArray = (array) => {
   // let currentIndex = array.length; 
   // let temporaryValue;
   // let randomIndex;

    const indexMapping = {};
    array.forEach((val,i)=>indexMapping[i]=i);

    // While there remain elements to shuffle...
    //while (0 !== currentIndex) {
        // Pick a remaining element...
        for(let currentIndex=0;currentIndex<array.length;currentIndex++){
         randomIndex = Math.floor(Math.random() * currentIndex);
      //  currentIndex -= 1;

        // And swap it with the current element.
       // temporaryValue = array[currentIndex];
         const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;

        // Map the new index to the original index
        //indexMapping[randomIndex] = currentIndex;
         if(randomIndex !== currentIndex && indexMapping[randomIndex] !== indexMapping[currentIndex])
        {
          const tempIndex = indexMapping[randomIndex];
          indexMapping[randomIndex] = currentIndex;
          indexMapping[currentIndex] = tempIndex;
        }
    }

 

    return [array, indexMapping];
}

module.exports = {
   shuffleArray
} 
/*const getRandomInt=(min, max)=> {
  return Math.floor(Math.random() * (max - min)) + min;
}
const shuffleArray=(sourceArray)=> {
    const resultArray = [];
    const indexesArray = sourceArray.map((x, i) => i);

    while (indexesArray.length) {
        const randomInt = getRandomInt(0, indexesArray.length);
        const randomIndex = indexesArray[randomInt];

        resultArray.push(sourceArray[randomIndex]);
        indexesArray.splice(randomInt, 1);
    }

    return resultArray;
}
module.exports = {
    getRandomInt,
    shuffleArray
};**/