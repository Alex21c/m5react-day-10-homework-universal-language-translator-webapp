import './App.css';
import axios from 'axios';
import './Assests/fontAwesomeProIcons/fontAwesomeIcons.css';
import supportedLangs  from './supportedLangs.json';
import LanguageSelect from './Components/LanguageSelect';
import SuccessAndErrorMsg from './Components/SuccessAndErrorMsg';
import { useState, useRef } from 'react';

const API_KEY = process.env.REACT_APP_X_RAPIDAPI_KEY_TEXT_TRANSLATOR2_BY_DICKYAGUSTIN;


function App() {
  
  // setting states
    let [stateTranslatedText, udpateStateTranslatedText] = useState(null);
    let [stateLoaderImageHidden, updateStateLoaderImageHidden] = useState(true);
    let [stateIsSubmitBtnDisabled, upateStateIsSubmitBtnDisabled] = useState(false);
    let [stateLabelSubmitButton, updateStateLabelSubmitButton] = useState('Translate');

    let [stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg] = useState({
      style: {
        Success: "text-green-300 text-[1.5rem]",
        Error: "text-red-300 text-[1.5rem]"
      },
      msgType: "Success",
      msg: "",
      displayNone: 'displayNone'        
    
  });

  // now making references
    let refTextareaSrcLang = useRef(null);
    let refTextareaDestinationLang = useRef(null);
    let refSrcLang= useRef(null);
    let refDestinationLang= useRef(null);

  // some helper functions
    function showLoaderImage(){
      updateStateLoaderImageHidden(false);
    }
    function hideLoaderImage(){
      updateStateLoaderImageHidden(true);
    }
    function showError(error){
      updateStateSuccessAndErrorMsg(previousState=>{
        return {
          ...previousState,
          msgType: 'Error',
          msg : error, 
          displayNone: ''
        }
      });
    }
    function hideError(){
      updateStateSuccessAndErrorMsg(previousState=>{
        return {
          ...previousState,
          displayNone: 'displayNone'
        }
      });
    }
    function handleUserTranslateRequest(event){
      // hidding output text field         
        udpateStateTranslatedText(null);

      // Safeguard
        if(stateIsSubmitBtnDisabled){
          return;
        }

      event.preventDefault();
      ////console.log(stateTextQuery);
      if(refTextareaSrcLang.current.value === ''){
        showError('Kindly provide text you want to translate to inside the textarea above!');
        return;
      }

      // i need to fetch the text value?
      hideError();
      // make api call
      makeAPICall();
    }
    async function axiosAPICall(){
      const encodedParams = new URLSearchParams();
      encodedParams.set('source_language', refSrcLang.current.value);
      encodedParams.set('target_language', refDestinationLang.current.value);
      encodedParams.set('text', refTextareaSrcLang.current.value);
      // //console.log('src and dstinationlang',  refSrcLang.current.value, refDestinationLang.current.value,  refTextareaSrcLang.current.value);
      // //console.log(API_KEY)
      // return ;
      
      const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        data: encodedParams,
      };
      
      try {
        const response = await axios.request(options);
        let translatedText = response.data.data.translatedText;
        //console.log(translatedText);
        // setting it as the value of textarea
        // which making it visible

        let desiredOutput=`${refTextareaSrcLang.current.value} \r\n\r\n ${translatedText}`;
        udpateStateTranslatedText(desiredOutput);

      } catch (error) {
        throw new Error(`failed to translate yours text! ${error}` );
      }      
    }
    async function makeAPICall(){
      try {
        // validating
          //console.log(refTextareaSrcLang.current.value)
  
        // disable button
          showLoaderImage();
          upateStateIsSubmitBtnDisabled(true);
          updateStateLabelSubmitButton('Translating...');
  // return;
          await axiosAPICall();
  
        // enable button
            hideLoaderImage();
            upateStateIsSubmitBtnDisabled(false);
            updateStateLabelSubmitButton('Translate');

        // now i want to clear the text area
          refTextareaSrcLang.current.value="";
        
      } catch (error) {
        showError('Something went wrong, please try again later, here is the error: ' + error.message);
      }
    }

// returning jsx

  return (
    <div id='wrapperUniversaLanguageTranslatorWebApp' className='mt-[2rem] pt-[1rem] border-2 border-slate-200 p-[2rem] w-[50rem]  m-auto rounded-md flex flex-col gap-[1rem] text-[1.2rem] text-slate-200 '>
      <h1 className=' text-[3rem] text-slate-50 flex gap-[1rem] justify-center items-center'>
        <i className="fa-duotone fa-language"></i>
        <span className='text-[2rem] font-semibold smallCaps appName'>Universal Language Translator WebApp</span>
      </h1>
      <LanguageSelect refernceHook={refSrcLang} supportedLangs={supportedLangs} name={'srcLang'} label={'Source Language'} defaultValue="en"/>
      <textarea ref={refTextareaSrcLang} rows={3} placeholder='Enter text You want to Translate' className='text-slate-900 transition focus:outline focus:outline-2 focus:outline-yellow-500 p-[1rem] rounded-md bg-stone-200'/>
      <LanguageSelect refernceHook={refDestinationLang} supportedLangs={supportedLangs} name={'destLang'} label={'Destination Language'}  defaultValue="hi"/>
      <div id='wrapperLoaderImage' className={`${stateLoaderImageHidden ? "displayNone" : "" } w-[25rem] h-[20rem] self-center `}>
        <img src={require('./Assests/Images/loader.png')} className="object-none  rounded-xl shadow-yellow-300 shadow-2xl  w-[100%] h-[100%]"/>
      </div>  
      <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/>   
      <button id='submitBtn' disabled={stateIsSubmitBtnDisabled} onClick={handleUserTranslateRequest} className={`select-none wrapperGeneratePassword mt-[1rem] flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50  hover:bg-yellow-400 transition cursor-pointer p-[1rem] rounded-md hover:text-stone-700 text-slate-900  bg-yellow-300  text-[2rem]  ${stateIsSubmitBtnDisabled === true? "disabled"  : "bg-yellow-300" } `}>
        <i className="fa-duotone fa-language"></i>
        <span className='font-semibold'>{stateLabelSubmitButton}</span>
        </button>
        {
        stateTranslatedText &&        
          <textarea  ref={refTextareaDestinationLang} rows={3} className='text-slate-900 transition focus:outline focus:outline-2 focus:outline-yellow-500 p-[1rem] rounded-md bg-stone-300' readOnly placeholder='Yours Translated text will be shown here' value={stateTranslatedText}/>
        }
    </div>

  );
}

export default App;
