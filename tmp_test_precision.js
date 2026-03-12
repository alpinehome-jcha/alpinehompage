
const ids = [
    1770186118067.499,
    1770260157206.4255,
    1770260183778.9463,
    1770260296862.2905,
    1770260305266.0002
];

ids.forEach(id => {
    const str = id.toString();
    const parsed = parseFloat(str);
    console.log(`Original: ${id}`);
    console.log(`String:   ${str}`);
    console.log(`Parsed:   ${parsed}`);
    console.log(`Match:    ${id === parsed}`);
    console.log('---');
});
