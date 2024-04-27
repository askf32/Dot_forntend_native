// import React, { useEffect, useState } from 'react'
// import { Text, View } from 'react-native'


// const Error = (error) => {
//     const [error, setError] = useState(errorMessage)
//     useEffect(() => {
//         let timeoutId;
    
//         if (error) {
//           // Set a timeout to clear the error state after 3 seconds
//           timeoutId = setTimeout(() => {
//             setError(null);
//           }, 2000);
//         }
    
//         return () => {
//           // Clear the timeout when the component unmounts or the error changes
//           clearTimeout(timeoutId);
//         };
//       }, [error]);
//   return (
//     <View>
// {error && 
//       <View className="bg-slate-300 p-2 rounded-2xl">
//         <Text className="text-center font-semibold text-red-500 ">{error}</Text>
//         </View>}
//     </View>
//   )
// }

// export default Error