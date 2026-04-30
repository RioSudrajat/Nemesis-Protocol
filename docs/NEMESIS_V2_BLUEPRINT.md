# NEMESIS V2 Blueprint

## Positioning

Nemesis should not be positioned as only a "vehicle protocol".

Nemesis V2 should be positioned as:

> **Nemesis Protocol is a DePIN for productive EV infrastructure asset**

This means Nemesis is the protocol layer for EV assets that:

- generate real economic activity
- can be verified through telemetry or metered usage
- can be financed through on-chain capital
- can distribute verified cashflows back to investors

The long-term vision is not only fleets.

The full scope is:

## Asset Classes

### 1. Mobility Assets

- EV ride-hailing rental bikes
- EV delivery bikes
- EV cargo bikes
- EV taxis
- EV vans
- EV shuttles
- EV buses

### 2. Charging Assets

- depot chargers
- public fast chargers
- swap stations
- corridor charging hubs

### 3. Energy Assets

- solar for EV depots
- battery storage
- exportable surplus electricity assets

So the phase 1 focus remains **productive mobility assets**, but the framing stays **all EV infrastructure**.

---

## Nemesis Thesis

Nemesis exists to turn productive EV infrastructure into investable, telemetry-verified, cashflow-generating on-chain products.

The protocol has 3 layers:

1. **Proof Layer**
- proves the asset exists
- proves the asset is active
- proves the asset is generate revenue
- proves the asset is maintained

2. **Financing Layer**
- brings capital into EV infrastructure
- structures pool products
- routes verified distributions to investors

3. **Protocol Layer**
- onboarding
- telemetry ingestion
- scoring
- monitoring
- reserve management
- distribution logic
- future secondary transfer rails

Nemesis is DePIN because it is anchored in real physical infrastructure and real machine activity.

Nemesis is not just blockchain theater.

---

## Why Nemesis Still Counts As DePIN

Nemesis remains a DePIN protocol if each asset performs measurable work that the network can verify.

### For Mobility Assets

- daily route logs
- km driven
- active hours
- route adherence
- daily usage metrics
- movement segments
- utilization rate
- downtime
- maintenance events

### For Charging Assets

- charger uptime
- charging sessions
- kWh delivered
- power quality
- occupancy / utilization

### For Energy Assets

- kWh generated
- kWh stored
- kWh exported
- battery cycles

If the work is measurable and the protocol organizes capital around that work, it fits the DePIN logic.

---

## Phase 1 Launch Wedge

Phase 1 should focus on:

> **Productive mobility assets, especially ride-hailing and rental EV bikes**

This is the strongest initial wedge in Indonesia because:

- rental pattern already exists
- drivers already understand daily fees
- market already exists through players like Electrum / Smoot and similar models
- the cashflow is easier to model than many speculative DePIN products
- telemetry can be installed
- collections can be tracked

### Critical Phase 1 Subcategory

Nemesis must explicitly include:

> **Ride-hailing EV rental assets**

Cashflow model:

- fixed daily rental
- fixed weekly rental
- rent-to-own installment

This is one of the most realistic first products for Indonesia.

---

## Product Architecture By Asset Type

Nemesis should not force the same financing structure across every EV asset class.

Different asset types need different products.

### Product A: Mobility Credit Pools

Best for:

- ride-hailing rental bikes
- delivery bikes
- cargo bikes
- small productive fleet bikes

Financial structure:

- credit-style pool
- rent-to-own or amortizing principal pool
- fixed remittance / fixed rental collection
- periodic distributions to investors

### Product B: Fleet Remittance Pools

Best for:

- EV taxis
- EV vans
- EV shuttles
- EV buses
- larger B2B fleet operators

Financial structure:

- contracted remittance pool
- operator remits fixed amount per route / vehicle / month
- investors receive distributions from collected pool receipts

### Product C: Yield Pools

Best for:

- chargers
- swap stations
- solar + storage
- corridor energy assets

Financial structure:

- revenue share pool
- net cashflow pool
- metered infrastructure yield model

This structure allows Nemesis to start in mobility and later expand naturally into DeCharge-like charging infrastructure and then into energy infrastructure.

---

## Core Phase 1 Product

For phase 1, the recommended main product is:

> **36-Month Rent-to-Own Mobility Credit Pool**

Why this is better than a 70/30 revenue split:

- principal can be recovered gradually
- easier to model exits
- easier to underwrite
- more aligned with existing rental behavior in Indonesia
- avoids overdependence on self-reported gross income
- investor economics become clearer

This is especially important because productive EV bikes in Indonesia often operate through a rental logic already.

---

## What Investors Are Actually Buying

Investors are not buying a vague token story.

Investors are buying:

- rights to pooled verified cashflows
- principal recovery over time
- reserve-backed protection layers
- exposure to productive EV infrastructure

For phase 1 mobility pools, investors are effectively funding:

- purchase of productive EV assets
- telemetry onboarding
- deployment into income-producing use

And in return receive:

- periodic yield
- periodic principal recovery
- residual / buyout settlement at maturity

---

## Proof Framework

Nemesis should organize all assets through 4 proofs.

### 1. Proof of Asset

Verifies:

- asset identity
- VIN / serial / asset ID
- ownership / financing pool mapping
- deployment status
- operator identity

### 2. Proof of Activity

Verifies:

- movement or operational use
- GPS-verified daily route logs
- distance traveled per day
- active usage hours
- route coverage within operational zones
- daily movement consistency
- idle versus active patterns
- charger sessions / kWh
- generation / export for energy assets

### 3. Proof of Revenue

Verifies:

- expected payment
- actual payment
- lateness
- arrears status

### 4. Proof of Maintenance

Verifies:

- servicing due
- servicing completed
- reserve usage
- workshop proof
- return-to-service status

---

## Revenue Logic For Phase 1 Ride-Hailing EV Bikes

### Base Assumptions

Planning assumptions:

- EV bike + telemetry + setup + onboarding = **Rp 25.000.000**
- monthly gross collection per productive rental bike = **Rp 1.500.000**

This aligns with a simplified logic such as:

- around `Rp 50.000/day`
- around `30 days`
- roughly `Rp 1.500.000/month`

This monthly inflow is the base cashflow into the pool per active unit.

---

## Final Agreed Monthly Split Per Bike

From **Rp 1.500.000 per month per unit**, use this split:

- **45% Principal Recovery** = `Rp 675.000`
- **20% Investor Yield** = `Rp 300.000`
- **10% Maintenance Reserve** = `Rp 150.000`
- **5% Default Reserve** = `Rp 75.000`
- **8% Operator Base Servicing Fee** = `Rp 120.000`
- **2% Operator Performance Fee** = `Rp 30.000`
- **10% Protocol Fee** = `Rp 150.000`

Total = `Rp 1.500.000`

This is the final working split for the phase 1 ride-hailing / rental bike model.

---

## Why Default Reserve Exists

Default reserve is a shock absorber.

It exists to cover temporary losses or disruptions such as:

- driver late payment
- driver stop operating
- unit temporarily idle
- operator collection shortfall
- repossession delay
- downtime before reassignment

Without default reserve:

- investor distributions become too fragile
- principal recovery gets interrupted too easily
- the pool becomes unstable after even a few bad units

### Example

If 3 units fail to remit for one month:

- shortfall = `3 x Rp 1.500.000 = Rp 4.500.000`

The default reserve can temporarily absorb that while the operator or protocol recovers, reassigns, or restructures those units.

---

## Why Maintenance Reserve Still Exists

Maintenance reserve is not the same as default reserve.

Maintenance reserve exists to fund:

- routine service
- tires
- brakes
- minor part replacement
- service downtime needs
- basic health upkeep

We reduced maintenance reserve from 12% to 10% and gave the freed 2% to operator performance fee.

That only works if:

- operator is truly active in field operations
- the operator helps keep assets alive and compliant
- the performance fee is only earned when KPIs are met

This keeps incentives aligned.

---

## Why Operator Needs Explicit Distribution

In this model the operator must be paid explicitly.

For ride-hailing rental bikes, operator responsibilities often include:

- finding and managing drivers
- collections
- route and deployment supervision
- field support
- reassignment after default
- service coordination
- repossession or recovery process

So operator economics should not be ignored.

### Operator Earnings in Phase 1

Operator receives:

- **8% base servicing fee**
- **2% performance fee if KPIs are achieved**

Total operator fee potential:

- `10%` of monthly pool cashflow per unit
- `Rp 150.000 / month / unit`

This is explicit and cleaner than hiding operator economics inside an unclear 70/30 logic.

---

## What The 2% Operator Performance Fee Means

The 2% operator performance fee should not be unconditional.

It should only be earned if the operator hits defined KPIs such as:

- uptime threshold
- collection rate threshold
- reassignment speed after default
- service compliance threshold

If KPI is not met:

- the 2% can remain in reserve
- or roll into maintenance / default buffer

This keeps the pool safer while still giving operators a strong reason to perform.

---

## Investor Yield Under This Model

### Per Unit

Monthly investor yield:

- `Rp 300.000`

Annual investor yield:

- `Rp 300.000 x 12 = Rp 3.600.000`

Against principal of `Rp 25.000.000`, that means:

- **cash yield = 14,4% per year**

### Important Distinction

This `14,4%` is the true cash yield.

It is not the same as total annual cash received.

Because investors also receive principal recovery.

---

## Investor Principal Recovery Under This Model

### Per Unit

Monthly principal recovery:

- `Rp 675.000`

Annual principal recovery:

- `Rp 8.100.000`

### Total Annual Cash Received By Investor

Investor gets:

- annual yield = `Rp 3.600.000`
- annual principal recovery = `Rp 8.100.000`

Total annual cash received:

- `Rp 11.700.000`

Relative to `Rp 25.000.000` initial principal:

- **46,8% annual cash distribution**

But this should never be marketed as pure yield.

It must be broken down honestly as:

- `14,4%` yield
- `32,4%` principal return

---

## 36-Month Outcome Per Bike

### Over 36 Months

- principal recovered = `Rp 675.000 x 36 = Rp 24.300.000`
- yield paid = `Rp 300.000 x 36 = Rp 10.800.000`
- maintenance reserve built = `Rp 150.000 x 36 = Rp 5.400.000`
- default reserve built = `Rp 75.000 x 36 = Rp 2.700.000`
- operator base fee = `Rp 120.000 x 36 = Rp 4.320.000`
- operator performance fee = `Rp 30.000 x 36 = Rp 1.080.000`
- protocol fee = `Rp 150.000 x 36 = Rp 5.400.000`

### Remaining Principal At End Of 36 Months

Initial principal:

- `Rp 25.000.000`

Less principal recovered:

- `Rp 24.300.000`

Remaining principal:

- **Rp 700.000**

This is the key reason the `Rp 25 juta` capex assumption works much better than `Rp 32 juta`.

The end-of-term buyout or residual settlement becomes small and manageable.

---

## Why 36 Months Makes More Sense Than 24 Months

At 36 months:

- remaining principal is only `Rp 700.000`

That means:

- investor principal is nearly fully repaid through regular collections
- final settlement is much easier
- refinancing pressure is smaller

So for ride-hailing bike pools:

> **36 months should be the default tenor**

---

## Exit Logic For Phase 1

Phase 1 mobility credit pools should not promise instant redemption.

Why:

- investor money is used to purchase real assets
- those assets are not immediately liquid
- monthly cashflows are already being distributed between yield, principal recovery, reserves, operator, and protocol

So the cleanest structure is:

### Default Rule

- pool is **closed-end**
- tenor = `36 months`
- investor receives monthly yield + monthly principal recovery
- principal is largely returned through amortization
- remaining balance is settled at maturity through buyout / rollover / residual settlement

### Early Exit

Early exit should happen mainly through:

- transfer to another investor
- protocol-assisted transfer desk
- limited secondary transfer later

Do **not** make instant principal redemption the core promise.

This is a credit-style infrastructure product, not a savings account.

---

## Maturity Settlement Options

At the end of 36 months, the last `Rp 700.000` residual principal per unit can be settled through one or more of:

1. **Buyout**
- driver / operator buys the asset out

2. **Rollover**
- unit is refinanced into a second cycle

3. **Residual Sale**
- unit is sold and final proceeds close the gap

4. **Protocol / Operator Top-Up**
- if the pool agreement requires clean closure

This is much more realistic than expecting an always-liquid NAV redemption model for early-stage mobility assets.

---

## Example Pool Sizes

### 1 Unit

- principal = `Rp 25.000.000`
- monthly pool cashflow = `Rp 1.500.000`
- investor monthly yield = `Rp 300.000`
- investor monthly principal recovery = `Rp 675.000`
- operator total monthly fee potential = `Rp 150.000`
- protocol monthly fee = `Rp 150.000`

### 20 Units

- total CAPEX = `Rp 500.000.000`
- monthly pool cashflow = `Rp 30.000.000`
- investor monthly yield = `Rp 6.000.000`
- investor monthly principal recovery = `Rp 13.500.000`
- maintenance reserve = `Rp 3.000.000`
- default reserve = `Rp 1.500.000`
- operator total monthly fee = `Rp 3.000.000`
- protocol monthly fee = `Rp 3.000.000`

### 50 Units

- total CAPEX = `Rp 1.250.000.000`
- monthly pool cashflow = `Rp 75.000.000`
- investor monthly yield = `Rp 15.000.000`
- investor monthly principal recovery = `Rp 33.750.000`
- maintenance reserve = `Rp 7.500.000`
- default reserve = `Rp 3.750.000`
- operator total monthly fee = `Rp 7.500.000`
- protocol monthly fee = `Rp 7.500.000`

---

## Protocol Revenue Logic

Nemesis should not depend only on a future token.

Protocol revenue must be real from day one.

### Revenue Sources

1. **Protocol Fee**
- 10% of monthly mobility pool collections in phase 1 bike pools

2. **Origination Fee**
- charged when a new pool is launched

3. **Telemetry / Monitoring Fee**
- embedded or unbundled in future B2B models

4. **Future Charging / Energy Yield Fees**
- later phases

5. **Future Transfer / Marketplace Fees**
- later phases

This makes Nemesis economically real before any token event.

---

## How Nemesis Expands Beyond Bikes

The long-term protocol must go beyond vehicle-only framing.

### Phase 1

Mobility Credit Pools:

- ride-hailing rental bikes
- delivery bikes
- cargo bikes

### Phase 1B

Fleet Remittance Pools:

- taxis
- vans
- shuttles
- buses

### Phase 2

Charging Yield Pools:

- depot charging
- fast chargers
- public charger corridors
- swap infrastructure

### Phase 3

Energy Yield Pools:

- solar for EV depots
- battery storage
- exportable electricity assets

### Phase 4

Integrated EV Infrastructure Pools:

- mobility assets
- charging assets
- energy assets

This is the path from:

- productive EV bikes

to:

- all EV infrastructure finance rails

---

## Final Strategic Recommendation

Nemesis V2 should launch with this identity:

> **Nemesis Protocol is a DePIN for productive EV infrastructure asset, starting with productive mobility assets whose activity, revenue, and maintenance can be verified through protocol telemetry.**

### Immediate phase 1 recommendation

Start with:

- ride-hailing EV rental bikes
- delivery bikes
- cargo bikes

Using:

- 36-month rent-to-own mobility credit pools
- `Rp 25.000.000` unit cost assumption
- `Rp 1.500.000` monthly cashflow assumption
- the final agreed split:
  - 45% principal
  - 20% investor yield
  - 10% maintenance
  - 5% default reserve
  - 8% operator base
  - 2% operator performance
  - 10% protocol

### Why this is the right v2 foundation

- it is realistic for Indonesia
- it keeps DePIN substance
- it creates real protocol revenue
- it gives operator aligned incentives
- it gives investors both yield and principal recovery
- it creates a clean bridge toward chargers and energy assets later

Nemesis should begin with mobility.

But it should always speak like a protocol for **all income-producing EV infrastructure assets**.
