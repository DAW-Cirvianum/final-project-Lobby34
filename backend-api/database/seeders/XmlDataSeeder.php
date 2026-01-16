<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class XmlDataSeeder extends Seeder
{
    private $ratingCoefficients = [];
    private $classCoefficients = [];

    public function run()
    {
        // 1. Load Math Coefficients
        $this->importCoefficients();

        // 2. Create Roles
        $this->createRoles();

        // 3. Import Base Data (Ships, Modules, FSDs)
        $this->importShipModels();
        $this->importFSDs();
        $this->importModules();

        // 4. Import Users (Decodes Base64 passwords)
        $this->importUsers();

        // 5. Import User Ships (Links everything together)
        $this->importUserShips();
    }

    private function createRoles()
    {
        DB::table('roles')->insertOrIgnore([
            ['id' => 1, 'name' => 'admin', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'user', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    private function importCoefficients()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/ClassRatingCoeficients.txt');
        
        if (!file_exists($path)) {
            $this->command->warn("Coefficient file not found at: $path");
            $this->ratingCoefficients = [12, 10, 8, 10, 11]; 
            $this->classCoefficients = [2.00, 2.15, 2.30, 2.45, 2.60, 2.75, 2.90];
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);
        $this->ratingCoefficients = array_map('intval', explode(',', $lines[0]));
        $this->classCoefficients = array_map('floatval', explode(',', $lines[1]));
        
        $this->command->info("Coefficients loaded.");
    }

    private function importShipModels()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/ShipModel.xml');
        
        if (!file_exists($path)) { 
            $this->command->error("CRITICAL: File missing at $path"); 
            return; 
        }

        $xml = simplexml_load_file($path);
        foreach ($xml->ShipModel as $ship) {
            DB::table('ship_models')->insertOrIgnore([
                'name' => (string)$ship['Name'],
                'hull_mass' => (float)$ship->HullMass,
                'max_power_plant' => (int)$ship->PowerPlant,
                'max_thrusters' => (int)$ship->Thrusters,
                'max_fsd' => (int)$ship->FSD,
                'max_life_support' => (int)$ship->LifeSuport,
                'max_power_distributor' => (int)$ship->PowerDistributor,
                'max_sensors' => (int)$ship->Sensors,
                'max_fuel_tank' => (int)$ship->FuelTank,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        $this->command->info("ShipModels imported.");
    }

    private function importFSDs()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/FSD.xml');
        
        if (!file_exists($path)) { 
            $this->command->error("CRITICAL: File missing at $path"); 
            return; 
        }

        $xml = simplexml_load_file($path);
        foreach ($xml->FSD as $fsd) {
            $class = (int)$fsd->Class;
            $ratingChar = (string)$fsd->Rating;
            
            $ratingIndex = ord($ratingChar) - ord('A');
            $classIndex = $class - 1;

            $rConst = isset($this->ratingCoefficients[$ratingIndex]) ? $this->ratingCoefficients[$ratingIndex] : 0;
            $cConst = isset($this->classCoefficients[$classIndex]) ? $this->classCoefficients[$classIndex] : 0;

            DB::table('fsds')->insertOrIgnore([
                'class_number' => $class,
                'rating_character' => $ratingChar,
                'mass' => (float)$fsd->Mass,
                'optimal_mass' => (float)$fsd->OMass,
                'max_fuel_jump' => (float)$fsd->MaxFuel,
                'class_constant' => $cConst,
                'rating_constant' => $rConst,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        $this->command->info("FSDs imported.");
    }

    private function importModules()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/Module.xml');
        
        if (!file_exists($path)) { 
            $this->command->error("CRITICAL: File missing at $path"); 
            return; 
        }

        $xml = simplexml_load_file($path);
        foreach ($xml->Module as $module) {
            DB::table('modules')->insertOrIgnore([
                'slot_type' => (int)$module['Type'],
                'class_number' => (int)$module->Class,
                'rating_character' => (string)$module->Rating,
                'mass' => (float)$module->Mass,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        $this->command->info("Modules imported.");
    }

    private function importUsers()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/User.xml');
        
        if (!file_exists($path)) { 
            $this->command->error("CRITICAL: File missing at $path"); 
            return; 
        }

        $xml = simplexml_load_file($path);
        foreach ($xml->User as $user) {
            $base64Pass = (string)$user->Password;
            $decodedPass = base64_decode($base64Pass); 
            
            DB::table('users')->insertOrIgnore([
                'name' => (string)$user->Name,
                'email' => strtolower((string)$user->Name) . '@example.com',
                'password' => Hash::make($decodedPass),
                'role_id' => 2,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        $this->command->info("Users imported.");
    }

    private function importUserShips()
    {
        // POINTING TO PRIVATE
        $path = storage_path('app/private/UserShip.xml');
        
        if (!file_exists($path)) { 
            $this->command->error("CRITICAL: File missing at $path"); 
            return; 
        }

        $xml = simplexml_load_file($path);
        
        foreach ($xml->UserShip as $uShip) {
            $user = DB::table('users')->where('name', (string)$uShip->Owner)->first();
            if (!$user) {
                $this->command->warn("User " . (string)$uShip->Owner . " not found. Skipping ship.");
                continue;
            }

            $model = DB::table('ship_models')->where('name', (string)$uShip->ShipModel)->first();
            if (!$model) {
                $this->command->warn("Ship Model " . (string)$uShip->ShipModel . " not found. Skipping ship.");
                continue;
            }
            
            $fsdString = (string)$uShip->FSD; // "5 A"
            $fsdParts = explode(' ', $fsdString);
            $fsd = DB::table('fsds')
                     ->where('class_number', $fsdParts[0])
                     ->where('rating_character', $fsdParts[1])
                     ->first();

            if (!$fsd) {
                $this->command->warn("FSD " . $fsdString . " not found. Skipping ship.");
                continue;
            }

            $shipId = DB::table('user_ships')->insertGetId([
                'user_id' => $user->id,
                'ship_model_id' => $model->id,
                'fsd_id' => $fsd->id,
                'total_mass' => 0, 
                'created_at' => now(), 'updated_at' => now(),
            ]);

            $modulesStr = (string)$uShip->CoreInternal;
            $moduleEntries = explode(',', $modulesStr);

            $totalModuleMass = 0;

            foreach ($moduleEntries as $entry) {
                $parts = explode(' ', trim($entry));
                $slot = $parts[0];
                $class = $parts[1];
                $rating = $parts[2];

                $module = DB::table('modules')
                            ->where('slot_type', $slot)
                            ->where('class_number', $class)
                            ->where('rating_character', $rating)
                            ->first();

                if ($module) {
                    DB::table('user_ship_modules')->insert([
                        'user_ship_id' => $shipId,
                        'module_id' => $module->id,
                        'installed_slot_index' => $slot,
                        'created_at' => now(), 'updated_at' => now(),
                    ]);
                    $totalModuleMass += $module->mass;
                }
            }

            $totalMass = $model->hull_mass + $fsd->mass + $totalModuleMass;
            DB::table('user_ships')->where('id', $shipId)->update(['total_mass' => $totalMass]);
        }
        $this->command->info("UserShips and their modules imported!");
    }
}