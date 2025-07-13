
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminPromotions = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Promotions Management</CardTitle>
          <CardDescription>
            Create and manage promotional campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Manage your promotional campaigns and discounts
            </div>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Promotion
            </Button>
          </div>

          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Promotions Yet</h3>
              <p>Create your first promotional campaign to boost sales</p>
            </div>
            <Button>
              <Plus size={16} className="mr-2" />
              Create First Promotion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPromotions;
