'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PermissionEntity } from '@/types/entities/permission.entitty';
import { useTranslations } from 'next-intl';

const ACTIONS = ['create', 'read', 'update', 'delete'] as const;
type Action = (typeof ACTIONS)[number];

type ResourceDef = {
  resource: string;
  labelKey: string;
  availableActions: Action[];
};

const RESOURCES: ResourceDef[] = [
  { resource: 'user', labelKey: 'user', availableActions: ['create', 'read', 'update', 'delete'] },
  { resource: 'role', labelKey: 'role', availableActions: ['create', 'read', 'update', 'delete'] },
  { resource: 'contact', labelKey: 'contact', availableActions: ['read', 'update', 'delete'] },
  { resource: 'skill-category', labelKey: 'skill_category', availableActions: ['create', 'read', 'update', 'delete'] },
  { resource: 'skill', labelKey: 'skill', availableActions: ['create', 'read', 'update', 'delete'] },
  {
    resource: 'project-category',
    labelKey: 'project_category',
    availableActions: ['create', 'read', 'update', 'delete'],
  },
  { resource: 'project', labelKey: 'project', availableActions: ['create', 'read', 'update', 'delete'] },
  { resource: 'subscriber', labelKey: 'subscriber', availableActions: ['read', 'delete'] },
  { resource: 'general-setting', labelKey: 'general_setting', availableActions: ['read', 'update'] },
];

type RolePermissionsMatrixProps = {
  allPermissions: PermissionEntity[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
};

export const RolePermissionsMatrix: React.FC<RolePermissionsMatrixProps> = ({
  allPermissions,
  selectedIds,
  onChange,
}) => {
  const t = useTranslations();

  const permissionMap = Object.fromEntries(allPermissions.map((p) => [p.action, p]));

  const toggle = (permissionId: number, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, permissionId]);
    } else {
      onChange(selectedIds.filter((id) => id !== permissionId));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-44">{t('roles.permissions.resource')}</TableHead>
          {ACTIONS.map((action) => (
            <TableHead key={action} className="text-center w-20">
              {t(`roles.permissions.actions.${action}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {RESOURCES.map(({ resource, labelKey, availableActions }) => (
          <TableRow key={resource}>
            <TableCell className="font-medium text-sm">{t(`roles.permissions.resources.${labelKey}`)}</TableCell>
            {ACTIONS.map((action) => {
              const isAvailable = (availableActions as string[]).includes(action);
              const permission = permissionMap[`${resource}::${action}`];
              const isChecked = !!permission && selectedIds.includes(permission.id);

              return (
                <TableCell key={action} className="text-center">
                  {isAvailable && permission ? (
                    <Checkbox checked={isChecked} onCheckedChange={(checked) => toggle(permission.id, !!checked)} />
                  ) : (
                    <span className="text-muted-foreground/30">—</span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
