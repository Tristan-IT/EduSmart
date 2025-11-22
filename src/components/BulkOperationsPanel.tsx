import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Edit, 
  Upload, 
  Download,
  ArrowUpDown,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelectedNode {
  _id: string;
  title: string;
  subject: string;
  difficulty: string;
}

export const BulkOperationsPanel: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);
  const [operation, setOperation] = useState<'update' | 'delete' | 'clone' | 'assign' | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Bulk Update
  const [updateData, setUpdateData] = useState({
    subject: '',
    difficulty: '',
    xpReward: '',
    gemsReward: '',
    tags: ''
  });

  // Clone Node
  const [cloneData, setCloneData] = useState({
    sourceNodeId: '',
    count: 1,
    titlePrefix: ''
  });

  const handleBulkUpdate = async () => {
    if (selectedNodes.length === 0) {
      toast({
        title: 'No nodes selected',
        description: 'Please select nodes to update',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const nodeIds = selectedNodes.map(n => n._id);
      
      const updates: any = {};
      if (updateData.subject) updates.subject = updateData.subject;
      if (updateData.difficulty) updates.difficulty = updateData.difficulty;
      if (updateData.xpReward) updates.xpReward = parseInt(updateData.xpReward);
      if (updateData.gemsReward) updates.gemsReward = parseInt(updateData.gemsReward);
      if (updateData.tags) updates.tags = updateData.tags.split(',').map(t => t.trim());

      const response = await fetch('/api/bulk-operations/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nodeIds, updates })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Bulk update successful',
          description: `Updated ${result.modifiedCount} nodes`
        });
        setSelectedNodes([]);
        setOperation(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (cascade: boolean = false) => {
    if (selectedNodes.length === 0) return;

    const confirmMsg = cascade
      ? `Delete ${selectedNodes.length} nodes and remove them from all prerequisites?`
      : `Delete ${selectedNodes.length} nodes?`;

    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const nodeIds = selectedNodes.map(n => n._id);

      const response = await fetch('/api/bulk-operations/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nodeIds, cascade })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Bulk delete successful',
          description: `Deleted ${result.deletedCount} nodes`
        });
        setSelectedNodes([]);
        setOperation(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloneNode = async () => {
    if (!cloneData.sourceNodeId || cloneData.count < 1) {
      toast({
        title: 'Invalid input',
        description: 'Please provide source node and count',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/bulk-operations/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sourceNodeId: cloneData.sourceNodeId,
          count: cloneData.count,
          modifications: {
            titlePrefix: cloneData.titlePrefix || undefined
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Clone successful',
          description: `Created ${result.count} clones`
        });
        setCloneData({ sourceNodeId: '', count: 1, titlePrefix: '' });
        setOperation(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Clone failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const template = JSON.parse(text);

      const response = await fetch('/api/bulk-operations/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ template, format: 'json' })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Import successful',
          description: `Imported ${result.count} nodes`
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Nodes Display */}
      {selectedNodes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">
                  {selectedNodes.length} Nodes Selected
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNodes([])}
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedNodes.map(node => (
                <Badge key={node._id} variant="secondary">
                  {node.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operation Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>
            Efficiently manage multiple skill tree nodes at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant={operation === 'update' ? 'default' : 'outline'}
              onClick={() => setOperation('update')}
              className="w-full"
              disabled={selectedNodes.length === 0}
            >
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>

            <Button
              variant={operation === 'delete' ? 'default' : 'outline'}
              onClick={() => setOperation('delete')}
              className="w-full"
              disabled={selectedNodes.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>

            <Button
              variant={operation === 'clone' ? 'default' : 'outline'}
              onClick={() => setOperation('clone')}
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </Button>

            <label htmlFor="import-file" className="w-full">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                type="button"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportTemplate}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Update Form */}
      {operation === 'update' && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Update {selectedNodes.length} Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="mathematics"
                  value={updateData.subject}
                  onChange={(e) => setUpdateData({ ...updateData, subject: e.target.value })}
                />
              </div>

              <div>
                <Label>Difficulty</Label>
                <Input
                  placeholder="beginner"
                  value={updateData.difficulty}
                  onChange={(e) => setUpdateData({ ...updateData, difficulty: e.target.value })}
                />
              </div>

              <div>
                <Label>XP Reward</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={updateData.xpReward}
                  onChange={(e) => setUpdateData({ ...updateData, xpReward: e.target.value })}
                />
              </div>

              <div>
                <Label>Gems Reward</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={updateData.gemsReward}
                  onChange={(e) => setUpdateData({ ...updateData, gemsReward: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                placeholder="algebra, equations, basics"
                value={updateData.tags}
                onChange={(e) => setUpdateData({ ...updateData, tags: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBulkUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Apply Updates'}
              </Button>
              <Button variant="outline" onClick={() => setOperation(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Delete Confirmation */}
      {operation === 'delete' && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">
              Delete {selectedNodes.length} Nodes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                This action cannot be undone. Deleted nodes will be permanently removed.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => handleBulkDelete(false)}
                disabled={loading}
              >
                Delete Nodes
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkDelete(true)}
                disabled={loading}
                className="border-red-300"
              >
                Delete & Remove from Prerequisites
              </Button>
              <Button variant="outline" onClick={() => setOperation(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clone Node Form */}
      {operation === 'clone' && (
        <Card>
          <CardHeader>
            <CardTitle>Clone Node</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Source Node ID</Label>
              <Input
                placeholder="Enter node ID to clone"
                value={cloneData.sourceNodeId}
                onChange={(e) => setCloneData({ ...cloneData, sourceNodeId: e.target.value })}
              />
            </div>

            <div>
              <Label>Number of Clones (max 50)</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={cloneData.count}
                onChange={(e) => setCloneData({ ...cloneData, count: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div>
              <Label>Title Prefix (optional)</Label>
              <Input
                placeholder="Week"
                value={cloneData.titlePrefix}
                onChange={(e) => setCloneData({ ...cloneData, titlePrefix: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Creates titles like: "Week 1", "Week 2", etc.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCloneNode} disabled={loading}>
                {loading ? 'Cloning...' : 'Create Clones'}
              </Button>
              <Button variant="outline" onClick={() => setOperation(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkOperationsPanel;
