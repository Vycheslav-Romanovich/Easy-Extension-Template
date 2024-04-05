//@ts-ignore
import * as CryptoJS from 'crypto-js'
import { environment } from './environment';

export const cryptPaymentData = (): string => {
    const data = `elangExtension-${Date.now()}`;
    
    const fkey = CryptoJS.enc.Utf8.parse(environment.cryptedKey);
    const fiv = CryptoJS.enc.Utf8.parse(environment.cryptedIvkey);
    
    const enc = CryptoJS.AES.encrypt(data, fkey, {
        iv: fiv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // decrypt data
    // const dec = CryptoJS.AES.decrypt(enc, fkey, {
    //     iv: fiv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7,
    // });
    // const decrypt = dec.toString(CryptoJS.enc.Utf8);
    
    const cryptedData = enc.ciphertext.toString(CryptoJS.enc.Base64);

    // const encrypted = CryptoJS.enc.Base64.parse(cryptedData);
    // const  decrypted = CryptoJS.AES.decrypt(cryptedData, fkey, {mode: CryptoJS.mode.CBC, iv: fiv});

    return cryptedData;
}