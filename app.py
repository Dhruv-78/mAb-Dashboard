from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)
df = pd.read_csv('data/data_mab.csv', encoding='utf-8')
df = df.apply(lambda x: x.astype(str).str.strip())


@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/get-mabs')
def get_mabs():
    return jsonify(sorted(df['mAb'].unique().tolist()))

@app.route('/get-temperatures')
def get_temperatures():
    mab = request.args.get('mAb')
    temps = df[df['mAb'] == mab]['Temperature'].unique().tolist()
    return jsonify(sorted(temps))

@app.route('/get-concentrations')
def get_concentrations():
    mab = request.args.get('mAb')
    temp = request.args.get('temperature')
    print(f"[DEBUG] Get concentrations for: mAb={mab}, temp={temp}")
    print(df['Temperature'].unique())
    print(df['Temperature'].apply(type).unique())
    filtered = df[(df['mAb']==mab)&(df['Temperature'] == temp)]
    print(f"[DEBUG] Filtered rows:\n{filtered}")

    concs = filtered['Concentration'].unique().tolist()
    return jsonify(sorted(concs))

@app.route('/get-stresses')
def get_stresses():
    mab = request.args.get('mAb')
    temp = request.args.get('temperature')
    conc = request.args.get('concentration')
    stresses = df[(df['mAb'] == mab) & (df['Temperature'] == temp) & (df['Concentration'] == conc)]['Chemical Stress'].unique().tolist()
    return jsonify(sorted(stresses))

@app.route('/result', methods=['POST'])
def result():
    mab = request.form['mab']
    temp = request.form['temperature']
    conc = request.form['concentration']
    stress = request.form['stress']

    df_filtered = df[
        (df['mAb'] == mab) &
        (df['Temperature'] == temp) &
        (df['Concentration'] == conc) &
        (df['Chemical Stress'] == stress)
    ]

    # Assume only one row matches
    kinetic_model = df_filtered['Kinetic model'].values[0]
    k_value = df_filtered['K'].values[0]
    k_unit = df_filtered['units'].values[0]

    return render_template(
        'result.html',
        mab=mab,
        temp=temp,
        conc=conc,
        stress=stress,
        kinetic_model=kinetic_model,
        k_value=k_value,
        k_unit=k_unit,
        rows=df_filtered.to_dict(orient='records')
    )

if __name__ == '__main__':
    app.run(debug=True)
