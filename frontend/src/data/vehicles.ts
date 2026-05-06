import { generateMockVehicles } from './generateMockVehicles'

/**
 * 100 mock vehicles generated with deterministic seeded RNG.
 * Distribution: ~75 active, ~10 maintenance, ~10 idle, ~5 inactive.
 * 83 vehicles have driverId assigned (matching overview "Active today" stat).
 */
export const MOCK_VEHICLES = generateMockVehicles(100)
