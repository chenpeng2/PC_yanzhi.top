 function getCookie(Name)
{
    var search = Name + "="
    if(document.cookie.length > 0)
    {
        var offset = document.cookie.indexOf(search)
        if(offset != -1)
        {
            offset += search.length
            var end = document.cookie.indexOf(";", offset)
            if(end == -1) end = document.cookie.length
            return document.cookie.substring(offset, end)
        }
        else return ""
    }
}
function sliceArr(array, size) {
 							var result = [];
 							for (var x = 0; x < Math.ceil(array.length / size); x++) {
 									var start = x * size;
 									var end = start + size;
 									result.push(array.slice(start, end));
 							}
 							return result;
 	}
function getRanking(base64,utf8,type){
    var data={type:type};
       var ori_data={
         data:data
       }
     var jsons=JSON.stringify(ori_data)
     var bytes = utf8.encode(jsons);
     var base64_data=base64.encode(bytes)
    const personalMessage = {
           method: "post",
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
           },
           body:"data="+base64_data,
    };
    return  personalMessage
  }
  function getHuodong(base64,utf8,type){
      var data={noticeType:type};
         var ori_data={
           data:data
         }
       var jsons=JSON.stringify(ori_data)
       var bytes = utf8.encode(jsons);
       var base64_data=base64.encode(bytes)
      const personalMessage = {
             method: "post",
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             body:"data="+base64_data,
      };
      return  personalMessage
    }
export default {getCookie,sliceArr,getRanking,getHuodong}
