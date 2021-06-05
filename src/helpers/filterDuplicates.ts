export default function filterDuplicates ( arr : any[], key?: string ) {
    if ( key ) {
      const keyList = arr.map(item => item[key]);
      return arr.filter( (item, index) => keyList.indexOf(item[key]) === index )
    } else {
      return arr.filter( (item, index) => arr.indexOf(item) === index )
    }
}