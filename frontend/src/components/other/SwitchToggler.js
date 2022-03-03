import style from "../../assets/css/switchToggler.module.css";

const SwitchToggler = () => {
  return (
    <div className={style.switch} >
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler"></label>
    </div>
  );
};

export default SwitchToggler;
