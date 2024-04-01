export default function LanguageSelect({supportedLangs, name, defaultValue, label, refernceHook}){
  return (
    <div className="wrapperLangSelect flex gap-[1rem] items-center">
      <label htmlFor={name} className="min-w-[12rem] text-right">{label}</label>
      <select ref={refernceHook} defaultValue={defaultValue} id={name} className="bg-slate-700 focus:outline-none focus:ring focus:ring-emerald-700 p-[1rem] pb-[.5rem] placeholder:text-slate-200 pt-[.5rem] rounded-md text-xl text-zinc-50">
      {

        Object.entries(supportedLangs).map(([key, value], idx)=>{
          // //console.log(key, value);
          let selected = defaultValue === key;
          return <option key={idx} name={name} value={key}  >{value}</option>

        })
      }
      </select>
    </div>

  );
}