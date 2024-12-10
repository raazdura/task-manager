export const convertToLocalTime = (targetDateTime: string): string  => {

    const targetDate = new Date(targetDateTime);
  
    // const now = new Date();
  
    // Convert to local time
    const localTime = targetDate.toLocaleString();
  
    // Calculate the time difference in milliseconds
    // const timeDifference = targetDate.getTime() - now.getTime();
  
    // if (timeDifference <= 0) {
    //   console.log("The deadline time has already passed.");
    //   return "The deadline time has already passed.";
    // }

    return localTime;
  
    // Convert time difference into days, hours, minutes, and seconds
    // const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    // const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
  }
  
  // Example usage
//   const targetDateTime = "2024-12-10T12:00:00Z"; // Example UTC time
//   convertToLocalTime(targetDateTime);


  