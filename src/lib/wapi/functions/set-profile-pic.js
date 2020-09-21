
export async function setProfilePic(obj){
    var id = await Store.Me.attributes,
    base64 = 'data:image/jpeg;base64,';
    return await Store.Profile.sendSetPicture(id.me._serialized, base64+obj.b, base64+obj.a);
}