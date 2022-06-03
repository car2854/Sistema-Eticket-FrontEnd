import Swal from "sweetalert2"

const errorHelpers = (err:any) => {
  console.log(err);
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: err.error.message,
  });
}


export {
  errorHelpers
}