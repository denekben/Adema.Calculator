import { bool, boolean } from "yup";

interface GraphPoint {
    X: number;
    Y: number;
}

interface Temperature {
    TemperatureValue: number;
    Points: GraphPoint[];
}

interface SPGR {
    SPGRValue: number;
    Temperatures: Temperature[];
}

export class ZFactorCalculator {
    private static spgrs: SPGR[] = [];

    public static async loadSPGRData(filePath: string): Promise<void> {
        try {
            const response = await fetch(filePath);
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: SPGR[] = await response.json();
            this.spgrs = data; // Сохраняем загруженные данные в статическом свойстве
        } catch (error) {
            console.error('Error loading SPGR data:', error);
        }
    }

    public static calculateZFactor(temp: number, spgr: number, pressure: number): number {

        const temps = this.spgrs.find(z => z.SPGRValue === spgr)?.Temperatures.sort((a, b) => a.TemperatureValue - b.TemperatureValue) || [];
        console.log(temp);

        let tempMin : number, tempMax : number;

        tempMin = temps[0].TemperatureValue;
        tempMax = temps[temps.length-1].TemperatureValue;

        if(temp <= tempMin){
            temp = tempMin;
            tempMax = tempMin;
        }
        else if(temp >= tempMax){
            temp = tempMax;
            tempMin = tempMax;
        }
        else {
            let fl: boolean = true;
            for(let i =0;i<temps.length-1;i++){
                if(temp === temps[i].TemperatureValue){
                    tempMax = temp;
                    tempMin = temp;
                    fl = false;
                    break;
                }
            }
            if(fl){
                for(let i =0;i<temps.length-2;i++){
                    if(temp > temps[i].TemperatureValue && temp < temps[i+1].TemperatureValue){
                        tempMin = temps[i].TemperatureValue;
                        tempMax = temps[i+1].TemperatureValue;
                    }
                }
            }
        }
        console.log(temp, tempMin, tempMax);
        const zMin = this.calculateDefaultZ(pressure, temps.find(t => t.TemperatureValue === tempMin)?.Points || []);
        const zMax = this.calculateDefaultZ(pressure, temps.find(t => t.TemperatureValue === tempMax)?.Points || []);
        console.log(zMin, (zMax - zMin), (temp / (tempMax + tempMin)));
        if(tempMin != tempMax) {
            return Number((zMin + (zMax - zMin) * (temp / (tempMax + tempMin))).toFixed(2));
        }  else {
            return Number(zMin.toFixed(2));
        };
    }

    private static calculateDefaultZ(pressure: number, points: GraphPoint[]): number {
        let sum = 0.0;
        for (let i = 0; i < points.length; i++) {
            let mul = 1.0;

            for (let j = 0; j < points.length; j++) {
                if (i !== j) {
                    mul *= (pressure - points[j].X) / (points[i].X - points[j].X);
                }
            }

            sum += mul * points[i].Y;
        }
        return Number(sum.toFixed(6));
    }
}

export class Calculation {
    static pl = (SG: number) : number | null => {
        const res = 62.4*SG;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static SG = (API: number) : number | null => {
        const res = 141.5/(131.5+API);
        return isNaN(res) ? null : Number(res.toFixed(6));
    }
    
    static pg = (SG: number, Po: number, To: number, Zfactor: number) : number | null => {
        const res = 2.7*((SG*Po)/(To*Zfactor));
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static Re = (pg: number, dm: number, Vt: number, mu: number) : number | null => {
        const res = 0.0049*pg*dm*Vt/mu;
        return isNaN(res) ? null: Number(res.toFixed(6));
    }

    static Cd = (Re: number) : number | null=> {
        const res = 24/Re + 3/Re**(1/2)+0.34;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }
    
    static Vt = (pl: number, pg: number, dm: number) : number | null => {
        const res = 0.0204*(((pl-pg)/pg)*dm)**(1/2);
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static VtWithCd = (pl: number, pg: number, dm: number, Cd: number) : number | null => {
        const res = 0.0119*(((pl-pg)/pg)*dm/Cd)**(1/2);
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static d2 = (To: number, Zfactor: number, Qg: number, Po: number,
        pg: number, pl: number, Cd: number, dm: number) : number | null => {
       const res = 5040*(To*Zfactor*Qg/Po) * ((pg / (pl-pg)) * Cd / dm) ** (1/2);
       return isNaN(res)? null : Number(res.toFixed(6));
   }

    static Ql = (Qw: number, Qo: number) : number | null => {
        const res = Qw+Qo;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static d2h = (tr: number, Ql: number) : number | null => {
        const res = tr * Ql / 0.12;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static h = (d2h: number, d2: number) : number | null => {
        const res = d2h / d2;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static Lss = (h: number, d: number) : number | null => {
        if(d<=36) {
            const res = (h+76)/12;
            return isNaN(res) ? null : Number(res.toFixed(6));
        } else {
            const res = (h+d+40)/12;
            return isNaN(res) ? null : Number(res.toFixed(6));
        }
    }

    static SR = (Lss: number, d: number) : number | null => {
        const res = (12*Lss)/d;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static dGasLeff = 
    (To: number, Zfactor: number, Qg: number, Po: number, 
        pg: number, pl: number, Cd: number, dm: number) : number | null => {
        const res = 420 * ( (To * Zfactor * Qg) / Po ) * (pg / (pl - pg) * Cd / dm) ** 0.5;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static GasLeff = (dGasLeff: number, d: number) : number | null => {
        const res = dGasLeff / d;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static d2LiquidLeff1 = (tr: number, Ql: number) : number | null => {
        const res = tr*Ql/0.7;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static LiquidLeff = (d2LiquidLeff: number, d: number) : number | null => {
        const res = d2LiquidLeff / d**2;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static GasLss = (GasLeff:number, d: number) : number | null => {
        const res = GasLeff + d/12;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static LiquidLss = (LiquidLeff: number) : number | null => {
        const res = 4/3*LiquidLeff;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static deltaSG = (SGw: number, SG: number) : number | null => {
        const res = SGw - SG;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static d2Water = (Qo: number, muo: number, deltaSG: number, dropletWater: number) : number | null => {
        const res = (6690 * ((Qo * muo) / (deltaSG * dropletWater ** 2)));
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static d2Oil = (Qw: number, muw: number, deltaSG: number, dropletOil: number) : number | null => {
        const res = (6690 * ((Qw * muw) / (deltaSG * dropletOil ** 2)));
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static hohw = (tro: number, Qo: number, trw: number, Qw: number) => {
        const res = (tro*Qo + trw*Qw) / 0.12;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static LssWithHohw = (hohw: number, d: number) : number | null=> {
        if(d<=36){
            const res = (hohw + 76) / 12;
            return isNaN(res) ? null : Number(res.toFixed(6));
        } else {
            const res = (hohw + d + 40) / 12;
            return isNaN(res) ? null : Number(res.toFixed(6));
        }
    }

    static homax = (tro: number, deltaSG: number, dm: number, muo: number) : number | null => {
        const res = (1.28 * 0.001) * tro * deltaSG * dm**2 / muo;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static AwA = (Qw: number, trw: number, tro: number, Qo: number) : number | null => {
        const res = 0.5 * Qw * trw / (tro * Qo + trw * Qw);
        return isNaN(res) ? null: Number(res.toFixed(6));
    }

    static dmax = (homax : number, beta: number) : number | null => {
        const res = homax/beta;
        return isNaN(res) ? null : Number(res.toFixed(2));
    }

    static d2LiquidLeff2 = (Qw: number, trw: number, Qo: number, tro: number) : number | null=> {
        const res = 1.42*(Qw*trw+Qo*tro);
        return isNaN(res) ? null : Number(res.toFixed(6));
    }

    static beta = (AwA: number) : number | null => {
        const res = 0.62*(AwA-0.99)**2-0.14;
        return isNaN(res) ? null : Number(res.toFixed(6));
    }
}