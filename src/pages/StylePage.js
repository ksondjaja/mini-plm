import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import StyleInfo from './style-tabs/StyleInfo';
import StyleImages from './style-tabs/StyleImages';
import StyleSamples from './style-tabs/StyleSamples';
import StyleSpecs from "./style-tabs/StyleSpecs";
import { 
    StylePageLayout,
    StyleMenu
} from "core";


function StylePage( props ) {

    const [token, setToken] = useState(window.localStorage.getItem('mini-plm-access') ?? '');
    const [tab, setTab] = useState("Overview")

    const [samples, setSamples] = useState([]);
    const [sampleCount, setSampleCount] = useState();
    const [WO, setWO] = useState("SMS");

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const [currentStyle, setCurrentStyle] = useState();
    const [currentStyleImages, setCurrentStyleImages] = useState();
    const [currentImagesInfo, setCurrentImagesInfo] = useState();
    const [loadedImages, setLoadedImages] = useState();

    const [loading, setLoading] = useState(true);
    const [specLoading, setSpecLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

    const [postResponse, setPostResponse] = useState();
    const [postError, setPostError] = useState();
    const [postLoading, setPostLoading] = useState();

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const controller = new AbortController();
    const styleUrl = location.pathname;

    const styleid = params["id"];

    const styleLinks = [
        { 
            id: 1,
            name: "Overview",
            url: '/'
        },
        {
            id: 2,
            name: "Images",
            url: "/images"
        },
        {
            id: 3,
            name: "Samples",
            url: "/samples"
        },
        {
            id: 4,
            name: "Specs",
            url: "/specs"
        },
        {
            id: 5,
            name: "Grading",
            url: "/grading"
        },
        {
            id: 6,
            name: "BOM",
            url: "/bom"
        },
        {
            id: 7,
            name: "Construction",
            url: "/construction"
        },
        {
            id: 8,
            name: "Costs",
            url: "/costs"
        },
    ]

    const handleLoadStylePage = async() => {
        const stylePage = await fetchStyle({
                                    StyleId: params["id"],
                                    Attributes: "StyleInfo, StyleImages"
                                }, token)

        const styleInfo = stylePage[0]
        const styleImages = stylePage[1]

        console.log(styleImages)

        let images = []

        if(Object.keys(styleImages).length>0){
            images = await fetchImages(styleImages)
        }
        
        setCurrentStyle(styleInfo);
        setCurrentStyleImages(images);
        setCurrentImagesInfo(Object.values(styleImages));
    }


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

            //setCurrentStyle((res.data)["Item"]["StyleInfo"])

            //setCurrentStyleImages((res.data)["Item"]["StyleImages"])

            console.log(currentStyle);

            const styleInfo = (res.data)["Item"]["StyleInfo"]

            const styleImages = (res.data)["Item"]["StyleImages"]

            return [styleInfo, styleImages];
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            //setLoading(false);
        }
    }

    const fetchImages = async(styleImages) => {

        const imageList = []

        for(const [key, value] of Object.entries(styleImages)){
            imageList.push(value.FileName)
        }

        //console.log(JSON.stringify(imageList))

        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + '/viewImages'),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        images: imageList
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            console.log("fetch images")

            return res.data;
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            //setImageLoading(false);
        }
    }

    const fetchImageFiles = async(styleImages) => {

        const imageList = []

        for(const [key, value] of Object.entries(styleImages)){
            imageList.push(value.FileName)
        }

        console.log(JSON.stringify(imageList))

        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + '/getFiles'),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        images: imageList
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            console.log("fetch images files")

            return res.data;
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            //setImageLoading(false);
        }
    }

    const fetchSamples = async (style, token, runOnLoad) => {
        let spl;
        let splCt;

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

            spl = (res.data)["Item"]["StyleSamples"]
            console.log(spl)

            return(spl)
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            //setLoading(false);
        }
    }

    const fetchSpecs = async (style, token, nested) =>{
        let specs;
    
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
    
          specs = (res.data)["Item"]["StyleSpecs"]
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{ 
          //if(!nested){
            //setSpecLoading(false)
          //};
          return (specs);
        }
      }

    const submitCreateSample = async (wo) => {
        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/addSample'), 
                wo,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log(wo);
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            // fetchSamples({
            //     StyleId: styleid,
            //     Attributes: "StyleSamples"
            // }, token, true);
            // setWO(null);
            // setPostLoading(false);
            navigate(0);
            // how to make sure that tab highlight "Samples" instead of "Overview"?
        }
    }
    

    useEffect(()=>{
        handleLoadStylePage()
        .then(
            ()=>{
                setLoading(false)
                setImageLoading(false)
            }
        )
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
                    styleUrl = {styleUrl}
                    tab = {tab}
                    setTab = {setTab}
                    {...props}
                />

                <Routes>
                    <Route
                        path = "/*"
                        element = {
                            <StyleInfo
                                styleid={styleid}
                                styleDetails = {currentStyle}
                                styleImages = {currentStyleImages}
                                imagesInfo = {currentImagesInfo}
                                loadedImages = {loadedImages}
                                imageLoading = {imageLoading}
                                token = {token}
                                {...props}
                            />
                        }
                    />

                    <Route
                        path = "/images"
                        element = {
                            <StyleImages
                                styleid={styleid}
                                styleImages = {currentStyleImages}
                                imagesInfo = {currentImagesInfo}
                                loadedImages = {loadedImages}
                                imageLoading = {imageLoading}
                                token = {token}
                            />
                        }
                    />

                    <Route
                        path = "/samples"
                        element = {
                            <StyleSamples
                                styleid={styleid}
                                stylename={currentStyle.StyleName}
                                token={token}
                                fetchSamples={fetchSamples}
                                fetchSpecs = {fetchSpecs}
                                submitCreateSample = {submitCreateSample}
                                samples = {samples}
                                setSamples = {setSamples}
                                sampleCount = {sampleCount}
                                setSampleCount = {setSampleCount}
                                WO = {WO}
                                setWO = {setWO}
                                BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                                {...props}
                            />
                        }
                    />
                        <Route
                        path = "/specs"
                        element = {
                            <StyleSpecs
                            token = {token}
                            styleid = {styleid}
                            fetchSamples = {fetchSamples}
                            fetchSpecs = {fetchSpecs}
                            samples = {samples}
                            setSamples = {setSamples}
                            sampleCount = {sampleCount}
                            setSampleCount = {setSampleCount}
                            BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                            {...props}
                        />
                        }
                    />
                </Routes>

            </StylePageLayout>
        }
        </>
    )
}

export default StylePage;