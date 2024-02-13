import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import StyleInfo from './style-tabs/StyleInfo';
import StyleMenu from './style-tabs/StyleMenu';
import { 
    StylePageLayout,
} from "core";


function StylePage( props ) {

    const [token, setToken] = useState(window.localStorage.getItem('mini-plm-access') ?? '');

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const [currentStyle, setCurrentStyle] = useState();
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const controller = new AbortController();

    const styleid = params["id"];

    const fetchStyle = async (styleid, token) => {
  
        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${styleid}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));
            setCurrentStyle((res.data)["Item"]);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
        }
    }
    

    useEffect(()=>{
        fetchStyle(styleid, token);

        //useEffect cleanup function
        return() => controller.abort();
    }, [token]);

    return(
        <>
        {!loading &&
            <StylePageLayout>
                <StyleMenu
                    styleid={styleid}
                    stylename={currentStyle.StyleName}
                    {...props}
                />

                <StyleInfo
                    styleDetails = {currentStyle}
                    token = {token}
                    {...props}
                /> 
            </StylePageLayout>
        }
        </>
    )
}

export default StylePage;