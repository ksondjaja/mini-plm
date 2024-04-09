import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
// import { itemToData } from 'dynamo-converters';
import StyleInfo from './style-tabs/StyleInfo';
import StyleMenu from './style-tabs/StyleMenu';
import StyleSamples from './style-tabs/StyleSamples';
import { 
    StylePageLayout,
} from "core";


function StylePage( props ) {

    const [tab, setTab] = useState("Overview");
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

            setCurrentStyle((res.data)["Item"]["StyleInfo"])

            console.log(currentStyle);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
        }
    }
    

    useEffect(()=>{
        fetchStyle(styleid, token);
        return() => controller.abort();
    }, [token]);

    return(
        <>
        {!loading &&
            <StylePageLayout>
                <StyleMenu
                    styleid={styleid}
                    stylename={currentStyle.StyleName}
                    tab={tab}
                    setTab={setTab}
                    {...props}
                />

                { tab==="Overview" &&
                    <StyleInfo
                        styleid={styleid}
                        styleDetails = {currentStyle}
                        token = {token}
                        {...props}
                    />
                } 

                { tab==="Samples" && 
                    <StyleSamples/>
                }
            </StylePageLayout>
        }
        </>
    )
}

export default StylePage;