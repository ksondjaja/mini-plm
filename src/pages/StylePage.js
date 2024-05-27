import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
// import { itemToData } from 'dynamo-converters';
import StyleInfo from './style-tabs/StyleInfo';
import StyleSamples from './style-tabs/StyleSamples';
import { 
    StylePageLayout,
    StyleMenu
} from "core";


function StylePage( props ) {

    const [tab, setTab] = useState("Overview");
    const [token, setToken] = useState(window.localStorage.getItem('mini-plm-access') ?? '');

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const [currentStyle, setCurrentStyle] = useState();
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const controller = new AbortController();

    const Style = {
        StyleId: params["id"],
        Attributes: "StyleInfo, StyleImages"
    }

    const styleid = params["id"];

    const styleLinks = ['Overview', 'Images', 'Samples', 'BOM', 'Construction', 'Costs']

    const fetchStyle = async (style, token) => {
  
        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${style.StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        attributes: style
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
        fetchStyle(Style, token);
        return() => controller.abort();
    }, [token]);

    return(
        <>
        {!loading &&
            <StylePageLayout>
                <StyleMenu
                    mode='stylePage'
                    styleid={styleid}
                    stylename={currentStyle.StyleName}
                    alignment="flex-end"
                    styleLinks = {styleLinks}
                    tab = {tab}
                    setTab = {setTab}
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
                    <StyleSamples
                        styleid={styleid}
                        token={token}
                        BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                        {...props}
                    />
                }
            </StylePageLayout>
        }
        </>
    )
}

export default StylePage;