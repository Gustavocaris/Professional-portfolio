import './styles/certification.css';

window.addEventListener('load', () => {
  const userResponse: boolean = confirm('⚠️ AVISO❗ está pagina esta em desenvolvimento. 😁okay ?');

  if (userResponse) {
    alert('Seja bem-vindo. acesse o Linkedin... deixei lá por enquanto as certif. ⭐');
  } else {
    alert('⚠️ HEY ❗ Você Leu meu aviso de antes 😜 ');
  }
});
