document.addEventListener('DOMContentLoaded', () => {
    const mabSelect = document.getElementById('mab-select');
    const tempSelect = document.getElementById('temp-select');
    const concSelect = document.getElementById('conc-select');
    const stressSelect = document.getElementById('stress-select');

    const resetDropdown = (dropdown, disable = true) => {
        dropdown.innerHTML = '<option value="">--Select--</option>';
        dropdown.disabled = disable;
    };

    // Load mAb options
    fetch('/get-mabs')
        .then(res => res.json())
        .then(mabs => {
            mabs.forEach(mab => {
                mabSelect.innerHTML += `<option value="${mab}">${mab}</option>`;
            });
        });

    // On mAb change → Load temperatures
    mabSelect.addEventListener('change', () => {
        const mab = mabSelect.value;

        resetDropdown(tempSelect, true);
        resetDropdown(concSelect);
        resetDropdown(stressSelect);

        if (mab) {
            fetch(`/get-temperatures?mAb=${encodeURIComponent(mab)}`)
                .then(res => res.json())
                .then(temps => {
                    temps.forEach(temp => {
                        tempSelect.innerHTML += `<option value="${temp}">${temp}</option>`;
                    });
                    tempSelect.disabled = false;
                });
        }
    });

    // On temperature change → Load concentrations
    tempSelect.addEventListener('change', () => {
        const mab = mabSelect.value;
        const temp = tempSelect.value;

        resetDropdown(concSelect, true);
        resetDropdown(stressSelect);

        if (mab && temp) {
            fetch(`/get-concentrations?mAb=${encodeURIComponent(mab)}&temperature=${encodeURIComponent(temp)}`)
                .then(res => res.json())
                .then(concs => {
                    concs.forEach(c => {
                        concSelect.innerHTML += `<option value="${c}">${c}</option>`;
                    });
                    concSelect.disabled = false;
                });
        }
    });

    // On concentration change → Load stresses
    concSelect.addEventListener('change', () => {
        const mab = mabSelect.value;
        const temp = tempSelect.value;
        const conc = concSelect.value;

        resetDropdown(stressSelect, true);

        if (mab && temp && conc) {
            fetch(`/get-stresses?mAb=${encodeURIComponent(mab)}&temperature=${encodeURIComponent(temp)}&concentration=${encodeURIComponent(conc)}`)
                .then(res => res.json())
                .then(stresses => {
                    stresses.forEach(s => {
                        stressSelect.innerHTML += `<option value="${s}">${s}</option>`;
                    });
                    stressSelect.disabled = false;
                });
        }
    });
    
    stressSelect.addEventListener('change', () => {
    const mab = mabSelect.value;
    const temp = tempSelect.value;
    const conc = concSelect.value;
    const stress = stressSelect.value;

    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('selection-form');

    // Fill hidden inputs
    document.getElementById('mab-hidden').value = mab;
    document.getElementById('temp-hidden').value = temp;
    document.getElementById('conc-hidden').value = conc;
    document.getElementById('stress-hidden').value = stress;

    // Enable submit only if all values are selected
    submitBtn.disabled = !(mab && temp && conc && stress);
    });
});