function validateForm() {
  const form = document.querySelector('.validate-form');
  const inputName = form.querySelector('[name = "name"]');
  const inputGender = form.querySelector('[name = "gender"]');
  const inputs = Array.from(form.querySelectorAll('.form-control'));

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const regexp = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
    inputs.forEach((input) => {
      if (input.value === '') {
        input.classList.add('is-invalid');
        return;
      }
      if (input === inputName) {
        if (!regexp.test(input.value)) {
          input.classList.add('is-invalid');
          return;
        }
      }
      if (input === inputGender) {
        if (inputGender.value !== 'male' && inputGender.value !== 'female') {
          inputGender.classList.add('is-invalid');
          return;
        }
        if (inputGender.value === '') {
          inputGender.classList.add('is-invalid');
          return;
        }
      }
      if (input.value) {
        input.classList.remove('is-invalid');
      }
    });

    const search = `?name=${inputName.value}&gender=${inputGender.value}`;

    await fetch(`${window.location.pathname}${search}`);
    window.location.pathname = '/users.html';
  });
}
window.addEventListener('load', validateForm);
